import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MagazineService } from '../../services/magazine.service';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '../../components/card/card.component';
import { SearchComponent } from '../../components/search/search.component';
import { SearchType } from '../../models/magazine.model';
import { HighlightQueryPipe } from '../../pipes/highlightQuery.pipe';

@UntilDestroy()
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,

    CardComponent,
    SearchComponent,
    HighlightQueryPipe,
    NgbTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent {
  magazineService = inject(MagazineService);
  closeResult = '';
  search = '';

  setSearch(value: SearchType) {
    this.search = value.query ?? '';
    this.magazineService.searchPdf(value);
  }
}
