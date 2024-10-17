import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MagazineService } from '@front/app/services/magazine.service';

import { Router } from '@angular/router';
import { CardComponent } from '@front/app/components/card/card.component';
import { SearchComponent } from '@front/app/components/search/search.component';
import { AuthService } from '@front/app/libs/auth/services/auth.service';
import { SearchType } from '@front/app/models/magazine.model';
import { HighlightQueryPipe } from '@front/app/pipes/highlightQuery.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, SearchComponent, HighlightQueryPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent implements AfterViewInit {
  magazineService = inject(MagazineService);
  #router = inject(Router);
  #authService = inject(AuthService);
  closeResult = '';
  search = '';

  ngAfterViewInit(): void {
    if (
      this.#authService.checkAfterLogin() &&
      !this.#authService.checkBiometricData()
    ) {
      const askBiometric = window.confirm(
        '¿Desea activar el acceso biométrico para futuros accesos?'
      );
      if (askBiometric) this.#authService.registerBiometrics();
    }
  }

  setSearch(value: SearchType) {
    this.search = value.query ?? '';
    this.magazineService.searchPdf(value);
  }
  goToBackOffice() {
    this.#router.navigate(['back-office']);
  }
}
