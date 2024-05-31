import { PartialTranslocoConfig } from '@ngneat/transloco/lib/transloco.config';
import { env } from '../environments/environment';

export const languageConfig: PartialTranslocoConfig = {
  availableLangs: ['es'],
  defaultLang: 'es',
  reRenderOnLangChange: true,
  prodMode: env.production,
};
