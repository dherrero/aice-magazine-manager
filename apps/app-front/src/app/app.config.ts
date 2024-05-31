import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@ngneat/transloco';
import { env } from '../environments/environment';
import { languageConfig } from './app.constants';
import { appRoutes } from './app.routes';
import { AuthModule } from './libs/auth/auth.module';
import { TranslocoHttpLoader } from './services/transloco-loader.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideTransloco({
      config: languageConfig,
      loader: TranslocoHttpLoader,
    }),
    importProvidersFrom(AuthModule.forRoot({ idpServer: env.api + 'auth' })),
  ],
};
