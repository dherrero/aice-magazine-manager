import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import HttpResponser from '../adapters/http/HttpResponser';
import { authService } from '../services';

class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const { email, password, remember } = req.body;
      const user = await authService.login(email, password);
      const userData = { id: user.id, email: user.email, remember };
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
            if (!decode.permisions)
              return HttpResponser.errorJson(
                res,
                { message: `Access denied code: ${randomCode}1` },
                401
              );
            const intersection = permision.filter((x) =>
              decode.permisions.includes(x)
            );
            if (!intersection.length)
              return HttpResponser.errorJson(
                res,
                { message: `Access denied code: ${randomCode}2` },
                401
              );
          } else if (permision) {
            if (!decode.permisions)
              return HttpResponser.errorJson(
                res,
                { message: `Access denied code: ${randomCode}3` },
                401
              );
            if (!decode.permisions.includes(permision))
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
      process.env.JWT_ACCESS_EXPIRES_IN || '4h'
    );
    res.setHeader('Authorization', accessToken);

    if (!next) {
      // If next is not defined, then it means that the request is a login request, so we need to send the refresh token
      const refreshToken = await authService.generateToken(
        { id: userData.id, remember: userData.remember },
        userData.remember ? '365d' : process.env.JWT_REFRESH_EXPIRES_IN || '8h'
      );
      res.setHeader('Refresh-Token', refreshToken);
      return HttpResponser.successEmpty(res);
    }

    next();
  };
}
const authController = new AuthController();
export default authController;
