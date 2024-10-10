import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  APP_INITIALIZER,
  inject,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { EMPTY, first, of, switchMap } from 'rxjs';
import { AUTH_CONFIGURATION } from './auth.constants';
import { AuthConfig } from './auth.interface';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [],
})
export class AuthModule {
  static forRoot(moduleConfig: AuthConfig): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        {
          provide: AUTH_CONFIGURATION,
          useValue: moduleConfig,
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: () => {
            const service = inject(AuthService);
            if (moduleConfig.authOnAppStart) {
              return () =>
                service.isLoggedIn$.pipe(
                  first(),
                  switchMap((isLoggedIn: boolean) => {
                    if (
                      isLoggedIn ||
                      (moduleConfig.loginPath &&
                        location.pathname.includes(moduleConfig.loginPath)) ||
                      (moduleConfig.loginPath &&
                        location.search?.includes(moduleConfig.loginPath))
                    ) {
                      if (service.checkAfterLogin()) {
                        return service.checkAndLoginWithBiometrics();
                      }
                      return EMPTY;
                    }
                    return of(service.logout());
                  })
                );
            }
            return () => Promise.resolve();
          },
        },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    };
  }
}
