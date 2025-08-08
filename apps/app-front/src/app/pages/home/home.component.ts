import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MagazineService } from '@front/app/services/magazine.service';

import { Router } from '@angular/router';
import { CardComponent } from '@front/app/components/card/card.component';
import { LanguageSwitcherComponent } from '@front/app/components/language-switcher/language-switcher.component';
import { SearchComponent } from '@front/app/components/search/search.component';
import { SearchType } from '@front/app/models/magazine.model';
import { HighlightQueryPipe } from '@front/app/pipes/highlightQuery.pipe';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    SearchComponent,
    HighlightQueryPipe,
    TranslocoModule,
    LanguageSwitcherComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent {
  magazineService = inject(MagazineService);
  #router = inject(Router);
  closeResult = '';
  search = '';

  setSearch(value: SearchType) {
    this.search = value.query ?? '';
    this.magazineService.searchPdf(value);
  }
  goToBackOffice() {
    this.#router.navigate(['back-office']);
  }
}
