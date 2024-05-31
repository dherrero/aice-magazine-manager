import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  #auth = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const authToken = this.#auth.token();
    const refreshToken = this.#auth.refreshToken();

    if (authToken && refreshToken) {
      const authReq = req.clone({
        headers: req.headers
          .set('Authorization', authToken)
          .set('refresh-token', refreshToken),
      });
      return next.handle(authReq).pipe(
        tap((event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse) {
            const token = event.headers.get('Authorization');
            if (token) {
              this.#auth.setToken(token);
            }
          }
        }),
        catchError(this.errorHandle.bind(this))
      );
    }

    return next.handle(req).pipe(catchError(this.errorHandle.bind(this)));
  }
  private errorHandle(error: HttpErrorResponse) {
    if (error.status === 401) {
      // TODO: create app status service
      // this.appStatus.alert = {
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: 'Session expired'
      // };
      this.#auth.logout('/login');
    }
    return throwError(() => error);
  }
}
