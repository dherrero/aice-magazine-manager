import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from '@front/app/services/language.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent implements OnInit {
  private translocoService = inject(TranslocoService);
  private languageService = inject(LanguageService);

  ngOnInit() {
    // El servicio ya maneja la inicialización automáticamente
    // Solo necesitamos asegurarnos de que el componente esté sincronizado
  }

  get currentLang(): string {
    return this.languageService.getCurrentLanguage();
  }

  switchLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }
}
