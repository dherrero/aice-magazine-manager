import HttpResponser from '@back/adapters/http/http.responser';
import { authService, userCrudService } from '@back/services';
import { NextFunction, Request, Response } from 'express';
import {
  AssertionResult,
  ExpectedAssertionResult,
  Fido2Lib,
  Fido2LibOptions,
} from 'fido2-lib';
import { TokenExpiredError } from 'jsonwebtoken';

class AuthController {
  #fidoConfig: Fido2LibOptions = {
    timeout: 60000,
    rpId: process.env.NODE_RPID ?? 'localhost',
    rpName: 'Aice Magacine',
    challengeSize: 32,
    attestation: 'direct',
    cryptoParams: [-7], // ECDSA with SHA-256
  };

  #fido2!: Fido2Lib;

  constructor() {
    this.#fido2 = new Fido2Lib(this.#fidoConfig);
  }

  createChallenge = async (req: Request, res: Response) => {
    try {
      const challenge = await this.#fido2.assertionOptions();
      const result = {
        timeout: challenge.timeout,
        rpId: challenge.rpId,
        challenge: Buffer.from(challenge.challenge).toString('base64'),
      };
      const token = req.header('Authorization');
      const decode = authService.verifyToken(token);
      userCrudService.put(decode.id, { challenge: result.challenge });
      return HttpResponser.successJson(res, result);
    } catch (err) {
      console.log(err);
      return HttpResponser.errorJson(res, err);
    }
  };

  registerCredentials = async (req: Request, res: Response) => {
    try {
      const { id, rawId, response } = req.body.credential;
      const { attestationObject, clientDataJSON } = response;
      const token = req.header('Authorization');
      const decode = authService.verifyToken(token);
      const userId = decode.id;
      const user = await userCrudService.getById({ id: userId });

      // Convertir rawId a ArrayBuffer
      const rawIdBuffer = authService.base64ToArrayBuffer(
        authService.base64UrlToBase64(rawId)
      );
      const origin = req.get('origin');

      // Verificar la attestation con fido2-lib
      const attestationResult = await this.#fido2.attestationResult(
        {
          id,
          rawId: rawIdBuffer,
          response: {
            attestationObject: attestationObject,
            clientDataJSON: clientDataJSON,
          },
        },
        {
          challenge: user.challenge as string,
          origin,
          factor: 'first',
          rpId: this.#fidoConfig.rpId,
        }
      );

      // Si la verificación es válida, guardar la clave pública y el contador
      if (attestationResult.audit.validExpectations) {
        const publicKey = attestationResult.authnrData.get(
          'credentialPublicKeyPem'
        );
        const counter = attestationResult.authnrData.get('counter');

        userCrudService.put(user.id, { publicKey, counter });
        return HttpResponser.successJson(res, { success: true });
      } else {
        return HttpResponser.errorJson(
          res,
          { message: 'Registro fallido.' },
          400
        );
      }
    } catch (err) {
      console.log(err);
      return HttpResponser.errorJson(res, err);
    }
  };

  loginCredentials = async (req: Request, res: Response) => {
    try {
      const { id, rawId, response } = req.body.credential;
      const challenge = req.body.challenge;

      // Obtener el usuario usando el challenge
      const user = await userCrudService.getById({ challenge });
      if (!user) {
        return HttpResponser.errorJson(res, { message: 'User not found' }, 401);
      }

      // Convertir rawId y authenticatorData  a ArrayBuffer
      const rawIdBuffer = authService.base64ToArrayBuffer(
        authService.base64UrlToBase64(rawId)
      );
      const authenticatorDataBuffer = authService.base64ToArrayBuffer(
        authService.base64UrlToBase64(response.authenticatorData)
      );

      // Construir el objeto assertionResult correctamente
      const assertionResult: AssertionResult = {
        id,
        rawId: rawIdBuffer,
        response: {
          authenticatorData: authenticatorDataBuffer,
          clientDataJSON: response.clientDataJSON,
          signature: response.signature,
          userHandle: response.userHandle ?? null,
        },
      };

      const origin = req.get('origin');
      const expectedAssertion: ExpectedAssertionResult = {
        challenge: challenge as string, // El challenge que se almacenó para el usuario
        rpId: this.#fidoConfig.rpId,
        origin,
        factor: 'either',
        userHandle: response.userHandle,
        publicKey: user.publicKey, // La clave pública almacenada para el usuario
        prevCounter: user.counter, // El contador previo almacenado
      };

      // Verificar la autenticación usando Fido2Lib
      const result = await this.#fido2.assertionResult(
        assertionResult,
        expectedAssertion
      );

      // Si la autenticación es válida, actualiza el contador y devuelve un token JWT
      if (result.audit.validExpectations) {
        // Actualizar el contador del usuario
        await userCrudService.put(user.id, {
          counter: result.authnrData.get('counter'),
        });

        // Preparar los datos del usuario para el token
        const userData = {
          id: user.id,
          email: user.email,
          permision: user.permission
            ? user.permission.split(/[\s,;]+/).filter(Boolean)
            : [],
          remember: false,
        };

        // Enviar la respuesta con los tokens
        return this.#responseWithTokens(res, userData);
      } else {
        return HttpResponser.errorJson(res, { message: 'Login fallido.' }, 400);
      }
    } catch (err) {
      console.log(err);
      return HttpResponser.errorJson(res, err);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password, remember } = req.body;
      const user = await authService.login(email, password);
      const userData = {
        id: user.id,
        email: user.email,
        permision: user.permission
          ? user.permission.split(/[\s,;]+/).filter(Boolean)
          : [],
        remember,
      };
      return this.#responseWithTokens(res, userData);
    } catch (err) {
      console.log(err);
      return HttpResponser.errorJson(res, err);
    }
  };

  hasPermission =
    (permision?: string | string[]) =>
    (req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'OPTIONS') {
        next();
      } else {
        const token = req.header('Authorization');
        const refreshToken = req.headers['refresh-token'] as string;
        const randomCode = Math.floor(Math.random() * 1000);
        if (!token || !refreshToken)
          return HttpResponser.errorJson(
            res,
            { message: `Access denied code: ${randomCode}0` },
            401
          );
        try {
          const decode = authService.verifyToken(token);
          res.locals.user = { ...decode };
          if (permision && Array.isArray(permision)) {
            if (!decode.permision)
              return HttpResponser.errorJson(
                res,
                { message: `Access denied code: ${randomCode}1` },
                401
              );
            const intersection = permision.filter((x) =>
              decode.permision.includes(x)
            );
            if (!intersection.length)
              return HttpResponser.errorJson(
                res,
                { message: `Access denied code: ${randomCode}2` },
                401
              );
          } else if (permision) {
            if (!decode.permision)
              return HttpResponser.errorJson(
                res,
                { message: `Access denied code: ${randomCode}3` },
                401
              );
            if (!decode.permision.includes(permision))
              return HttpResponser.errorJson(
                res,
                { message: `Access denied code: ${randomCode}4` },
                401
              );
          }
          next();
        } catch (error) {
          if (error instanceof TokenExpiredError) {
            return this.#refreshToken(req, res, next);
          } else {
            return HttpResponser.errorJson(
              res,
              { message: 'Invalid token' },
              401
            );
          }
        }
      }
    };

  #refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers['refresh-token'] as string;
    if (!refreshToken) {
      return HttpResponser.errorJson(
        res,
        { message: 'Access Denied. No refresh token provided.' },
        401
      );
    }

    try {
      const decode = authService.verifyToken(refreshToken);
      const user = await authService.getUser(decode.id);
      const userData = {
        id: user.id,
        email: user.email,
        remember: decode.remember,
        permision: user.permission
          ? user.permission.split(/[\s,;]+/).filter(Boolean)
          : [],
      };
      res.locals.user = { ...userData };
      return this.#responseWithTokens(res, userData, next);
    } catch (error) {
      return HttpResponser.errorJson(res, { message: 'Invalid token' }, 401);
    }
  };

  #responseWithTokens = async (
    res: Response,
    userData,
    next?: NextFunction
  ) => {
    const accessToken = await authService.generateToken(
      userData,
      process.env.NODE_JWT_ACCESS_EXPIRES_IN || '4h'
    );
    res.setHeader('Authorization', accessToken);

    if (!next) {
      // If next is not defined, then it means that the request is a login request, so we need to send the refresh token
      const refreshToken = await authService.generateToken(
        { id: userData.id, remember: userData.remember },
        userData.remember
          ? '365d'
          : process.env.NODE_JWT_REFRESH_EXPIRES_IN || '8h'
      );
      res.setHeader('Refresh-Token', refreshToken);
      return HttpResponser.successEmpty(res);
    }

    next();
  };
}
const authController = new AuthController();
export default authController;
