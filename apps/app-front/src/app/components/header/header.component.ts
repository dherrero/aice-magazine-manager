import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from '@front/app/components/language-switcher/language-switcher.component';
import { AuthService } from '@front/app/libs/auth/services/auth.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    LanguageSwitcherComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  private authService = inject(AuthService);

  get isLoggedIn(): boolean {
    return this.authService.token() !== '';
  }

  get user(): Record<string, any> {
    return this.authService.tokenDecoded;
  }

  logout(): void {
    this.authService.logout();
  }
}
