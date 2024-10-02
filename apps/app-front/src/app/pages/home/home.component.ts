import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MagazineService } from '@front/app/services/magazine.service';

import { Router } from '@angular/router';
import { CardComponent } from '@front/app/components/card/card.component';
import { SearchComponent } from '@front/app/components/search/search.component';
import { SearchType } from '@front/app/models/magazine.model';
import { HighlightQueryPipe } from '@front/app/pipes/highlightQuery.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, SearchComponent, HighlightQueryPipe],
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
