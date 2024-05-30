/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { UploadComponent } from '../../components/upload/upload.component';
import { SearchService } from '../../services/search.service';

import {
  NgbDatepickerModule,
  NgbModal,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
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
    UploadComponent,
    NgbDatepickerModule,
    CardComponent,
    SearchComponent,
    HighlightQueryPipe,
    NgbTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent {
  #modalService = inject(NgbModal);
  magazineService = inject(SearchService);
  closeResult = '';
  search = '';

  open(content: TemplateRef<any>) {
    this.#modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  setSearch(value: SearchType) {
    this.search = value.query ?? '';
    this.magazineService.searchMagazines(value);
  }
}
