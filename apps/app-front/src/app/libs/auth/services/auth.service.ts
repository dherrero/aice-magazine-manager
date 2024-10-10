import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import {
  AFTER_LOGIN_STORAGE_KEY,
  AUTH_CONFIGURATION,
  REFRESH_TOKEN_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
} from '../auth.constants';
import { AuthConfig, Login, TokenDecoded } from '../auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = signal<string>(window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? '');
  refreshToken = signal<string>(
    window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? ''
  );
  isLoggedIn$!: Observable<boolean>;

  get tokenDecoded(): TokenDecoded | null {
    return this.token
      ? JSON.parse(window.atob(this.token().split('.')[1]))
      : null;
  }

  #apiBase = '/login';
  #authConfig: AuthConfig = inject(AUTH_CONFIGURATION);
  #http: HttpClient = inject(HttpClient);
  #router: Router = inject(Router);

  constructor() {
    const isLoggedIn = computed(() => {
      return this.token() !== '';
    });
    this.isLoggedIn$ = toObservable(isLoggedIn);
  }

  login(loginData: Login) {
    return this.#http
      .post(this.#authConfig.idpServer + this.#apiBase, loginData, {
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          window.localStorage.setItem(AFTER_LOGIN_STORAGE_KEY, '1');
          this.setToken(response.headers.get('Authorization') ?? '');
          this.setRefresh(response.headers.get('Refresh-Token') ?? '');
        }),
        tap(() => {
          this.checkAndLoginWithBiometrics();
        })
      );
  }

  logout(redirect?: string) {
    this.cleanTokens();
    if (redirect) {
      this.#router.navigateByUrl(redirect);
    }
  }

  setToken(token: string) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    this.token.set(token);
  }

  doPing() {
    return this.#authConfig.pingUrl
      ? this.#http.get<null>(this.#authConfig.pingUrl)
      : of(null);
  }

  async registerBiometrics() {
    const token = this.tokenDecoded;
    // Obtener el challenge generado por el backend
    const challenge: number | undefined = 8; /* await this.#http
      .get<number>('/auth/webauthn-challenge')
      .toPromise(); */
    if (!challenge || !token) {
      throw new Error('User dont loggedin');
    }

    const publicKeyCredentialCreationOptions = {
      challenge: new Uint8Array(challenge),
      rp: {
        name: 'aice-magazine-manager',
      },
      user: {
        id: new TextEncoder().encode(`${token.id}`),
        name: token.email,
        displayName: token.email.split('@')[0],
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
      ] as PublicKeyCredentialParameters[],
      authenticatorSelection: {
        authenticatorAttachment: 'platform' as AuthenticatorAttachment, // Para usar autenticadores integrados (biometría)
        userVerification: 'required' as UserVerificationRequirement,
      },
      timeout: 60000,
      attestation: 'direct' as AttestationConveyancePreference,
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    console.log(credential);

    // Enviar las credenciales al backend para registrar la clave pública
    return await of(true).toPromise(); //await this.#http.post('/auth/webauthn-register', credential).toPromise();
  }

  async loginWithBiometrics() {
    // Obtener el challenge y el ID de la credencial desde el backend
    const response = {
      challengeBase64: 'c29tZVJhbmRvbUNoYWxsZW5nZUJhc2U2NA==',
      credentialIdBase64: 'bW9ja2VkQ3JlZGVudGlhbElkMTIzNDU=',
    }; //await this.#http.get<ChallengeDTO>('/auth/webauthn-challenge').toPromise();
    const { challengeBase64, credentialIdBase64 } = response;

    // Convertir el challenge y el ID de la credencial de base64 a Uint8Array
    const challenge = Uint8Array.from(atob(challengeBase64), (c) =>
      c.charCodeAt(0)
    );
    const credentialId = Uint8Array.from(atob(credentialIdBase64), (c) =>
      c.charCodeAt(0)
    );

    const publicKeyCredentialRequestOptions = {
      challenge: challenge, // Uint8Array del challenge generado por el backend
      allowCredentials: [
        {
          id: credentialId, // ID de la credencial del usuario (recuperado del backend)
          type: 'public-key',
        },
      ] as PublicKeyCredentialDescriptor[],
      userVerification: 'required' as UserVerificationRequirement, // Asegurar la verificación del usuario
      timeout: 60000,
    };

    // Autenticar al usuario usando la API WebAuthn
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    // Enviar la respuesta firmada al backend para validarla
    //await this.#http.post('/auth/webauthn-login', assertion).toPromise();
    of(true).toPromise();
  }

  async checkAndLoginWithBiometrics() {
    try {
      // Intentar obtener credenciales almacenadas (biometría) sin mostrar un diálogo
      const publicKeyCredentialRequestOptions = {
        publicKey: {
          challenge: new Uint8Array(0), // No necesitamos un challenge aún
          allowCredentials: [], // Permitir todas las credenciales almacenadas
          userVerification: 'preferred' as UserVerificationRequirement, // No obliga al usuario, pero si está disponible la biometría, la usará
        },
      };

      // Usar navigator.credentials.get() para verificar si hay credenciales almacenadas
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions.publicKey,
      });

      if (credential) {
        // Si hay credenciales almacenadas, llamar a loginWithBiometrics
        await this.loginWithBiometrics();
      } else {
        // Si no hay credenciales, redirigir al IdP (Identity Provider) para login tradicional
        this.logout(this.#authConfig.loginPath);
      }
    } catch (error) {
      console.error('Error while checking for biometrics:', error);
      // Si ocurre un error o no hay credenciales almacenadas, redirigir al IdP
      //  this.logout(this.#authConfig.loginPath);
    }
  }

  checkAfterLogin(): boolean {
    const after_login = window.localStorage.getItem(AFTER_LOGIN_STORAGE_KEY);
    window.localStorage.removeItem(AFTER_LOGIN_STORAGE_KEY);
    return Boolean(after_login);
  }

  private setRefresh(token: string) {
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    this.refreshToken.set(token);
  }

  private cleanTokens() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    this.token.set('');
    this.refreshToken.set('');
  }
}
