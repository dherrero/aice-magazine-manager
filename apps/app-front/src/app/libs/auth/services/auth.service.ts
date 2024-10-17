import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  firstValueFrom,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  AFTER_LOGIN_STORAGE_KEY,
  AUTH_CONFIGURATION,
  REFRESH_TOKEN_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
} from '../auth.constants';
import {
  AuthConfig,
  CredentialData,
  Login,
  TokenDecoded,
} from '../auth.interface';

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

  #loginApi = '/login';
  #credentialApi = '/challenge-credential';
  #credentialLoginApi = '/login-credential';
  #credentialRegisterApi = '/register-credential';
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
      .post(this.#authConfig.idpServer + this.#loginApi, loginData, {
        observe: 'response',
      })
      .pipe(
        tap((response) => {
          window.localStorage.setItem(AFTER_LOGIN_STORAGE_KEY, '1');
          this.setToken(response.headers.get('Authorization') ?? '');
          this.setRefresh(response.headers.get('Refresh-Token') ?? '');
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
    const userEmail = this.tokenDecoded?.email;
    const userId = this.tokenDecoded?.id;
    if (!userEmail || !userId) {
      throw new Error('No user found');
    }

    const challenge = await firstValueFrom(
      this.#http.get<{ challenge: string; rpId: string; timeout: number }>(
        this.#authConfig.idpServer + this.#credentialApi
      )
    );

    const challengeBuffer = Uint8Array.from(atob(challenge.challenge), (c) =>
      c.charCodeAt(0)
    );
    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: challengeBuffer,
      rp: { name: 'Aice Magacine', id: challenge.rpId },
      user: {
        id: Uint8Array.from(`${userId}`, (c) => c.charCodeAt(0)),
        name: userEmail,
        displayName: userEmail.split('@')[0],
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'direct',
    };

    try {
      const credential = (await navigator.credentials.create({
        publicKey,
      })) as PublicKeyCredential;
      this.storeCredential(credential, challenge.challenge);
      const attestationResponse =
        credential.response as AuthenticatorAttestationResponse;
      const registrationData = {
        id: credential.id, // Este es el Credential ID que el backend espera comparar con credId
        rawId: this.arrayBufferToBase64(credential.rawId), // Enviamos rawId en Base64
        response: {
          attestationObject: this.arrayBufferToBase64(
            attestationResponse.attestationObject
          ),
          clientDataJSON: this.arrayBufferToBase64(
            attestationResponse.clientDataJSON
          ),
        },
        type: credential.type,
      };

      this.#http
        .post(this.#authConfig.idpServer + this.#credentialRegisterApi, {
          credential: registrationData,
          challenge: challenge.challenge,
        })
        .subscribe();
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  }

  async loginWithBiometrics(): Promise<Observable<boolean>> {
    const storedCredential = this.getStoredCredential();
    if (!storedCredential) {
      throw new Error('No stored credential found');
    }
    const challengeBuffer = Uint8Array.from(
      atob(storedCredential.challenge),
      (c) => c.charCodeAt(0)
    );
    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: challengeBuffer,
      allowCredentials: [
        {
          id: new Uint8Array(storedCredential.rawId),
          type: 'public-key',
        },
      ],
      userVerification: 'required',
      timeout: 60000,
    };

    try {
      const credential = (await navigator.credentials.get({
        publicKey,
      })) as PublicKeyCredential;
      //return credential;

      return this.#http
        .post<void>(
          this.#authConfig.idpServer + this.#credentialLoginApi,
          {
            credential,
            challenge: storedCredential.challenge,
          },
          {
            observe: 'response',
          }
        )
        .pipe(
          tap((response) => {
            this.setToken(response.headers.get('Authorization') ?? '');
            this.setRefresh(response.headers.get('Refresh-Token') ?? '');
          }),
          switchMap(() => of(true))
        );
    } catch (err) {
      console.error('Authentication failed', err);
      return throwError(() => err);
    }
  }

  checkBiometricData(): boolean {
    return this.getStoredCredential() !== null && 'credentials' in navigator;
  }

  checkAfterLogin(): boolean {
    const check = window.localStorage.getItem(AFTER_LOGIN_STORAGE_KEY) === '1';
    window.localStorage.removeItem(AFTER_LOGIN_STORAGE_KEY);
    return check;
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

  private arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  private storeCredential(credential: PublicKeyCredential, challenge: string) {
    const credentialData: CredentialData = {
      rawId: Array.from(new Uint8Array(credential.rawId)),
      challenge,
    };
    localStorage.setItem('webauthn_credential', JSON.stringify(credentialData));
  }

  private getStoredCredential(): CredentialData | null {
    const storedCredential = localStorage.getItem('webauthn_credential');
    return storedCredential ? JSON.parse(storedCredential) : null;
  }
}
