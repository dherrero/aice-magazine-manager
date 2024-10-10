import { InjectionToken } from '@angular/core';
import { AuthConfig } from './auth.interface';

export const AUTH_CONFIGURATION = new InjectionToken<AuthConfig>(
  'AUTH_CONFIGURATION'
);

export const TOKEN_STORAGE_KEY = 'authToken';
export const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
export const AFTER_LOGIN_STORAGE_KEY = 'after_login';
