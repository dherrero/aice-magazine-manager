import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly STORAGE_KEY = 'transloco-lang';
  private readonly AVAILABLE_LANGS = ['es', 'ca'];
  private readonly DEFAULT_LANG = 'es';

  private currentLangSubject = new BehaviorSubject<string>(
    this.getStoredLanguage()
  );
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translocoService: TranslocoService) {
    // Inicializar el idioma al arrancar la aplicación
    this.initializeLanguage();
  }

  private getStoredLanguage(): string {
    try {
      const storedLang = localStorage.getItem(this.STORAGE_KEY);
      return storedLang && this.AVAILABLE_LANGS.includes(storedLang)
        ? storedLang
        : this.DEFAULT_LANG;
    } catch (error) {
      console.warn('Error reading language from localStorage:', error);
      return this.DEFAULT_LANG;
    }
  }

  private setStoredLanguage(lang: string): void {
    try {
      if (this.AVAILABLE_LANGS.includes(lang)) {
        localStorage.setItem(this.STORAGE_KEY, lang);
      }
    } catch (error) {
      console.warn('Error saving language to localStorage:', error);
    }
  }

  private initializeLanguage(): void {
    const storedLang = this.getStoredLanguage();
    const currentLang = this.translocoService.getActiveLang();

    if (storedLang !== currentLang) {
      this.translocoService.setActiveLang(storedLang);
      this.currentLangSubject.next(storedLang);
    } else {
      this.currentLangSubject.next(currentLang);
    }
  }

  setLanguage(lang: string): void {
    if (this.AVAILABLE_LANGS.includes(lang)) {
      this.setStoredLanguage(lang);
      this.translocoService.setActiveLang(lang);
      this.currentLangSubject.next(lang);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }

  getAvailableLanguages(): string[] {
    return [...this.AVAILABLE_LANGS];
  }

  getDefaultLanguage(): string {
    return this.DEFAULT_LANG;
  }
}
