import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import {
  AUTH_CONFIGURATION,
  REFRESH_TOKEN_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
} from '../auth.constants';
import { AuthConfig, Login } from '../auth.interface';

@Injectable()
export class AuthService {
  token = signal<string>(window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? '');
  refreshToken = signal<string>(
    window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? ''
  );
  isLoggedIn$!: Observable<boolean>;

  get tokenDecoded() {
    return this.token
      ? JSON.parse(window.atob(this.token().split('.')[1]))
      : {};
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
