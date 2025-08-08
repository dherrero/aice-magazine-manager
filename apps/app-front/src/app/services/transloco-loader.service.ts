import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';

import { Observable, of } from 'rxjs';
import ca from '../../../assets/i18n/ca.json';
import es from '../../../assets/i18n/es.json';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  private languages: Record<string, Translation> = { es, ca };

  getTranslation(lang: string): Observable<Translation> {
    return lang in this.languages
      ? of(this.languages[lang])
      : this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
