/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UploadComponent } from '../../components/upload/upload.component';
import { MagazineService } from '../../services/magazine.service';

import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from '../../components/card/card.component';
import { HighlightQueryPipe } from '../../pipes/highlightQuery.pipe';

@UntilDestroy()
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UploadComponent,
    NgbDatepickerModule,
    CardComponent,
    HighlightQueryPipe,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent implements OnInit {
  #fb = inject(FormBuilder);
  #modalService = inject(NgbModal);
  magazineService = inject(MagazineService);
  closeResult = '';

  search = this.#fb.group({
    query: [''],
  });

  ngOnInit() {
    this.search.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value.query && value.query.length > 3) {
        this.magazineService.searchMagazines(value.query);
      } else {
        this.magazineService.cleanResults();
      }
    });
  }

  open(content: TemplateRef<any>) {
    this.#modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
