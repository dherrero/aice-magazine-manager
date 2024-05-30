import { Component, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadComponent } from '../../../../components/upload/upload.component';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [UploadComponent],
  templateUrl: './magazines.component.html',
  styleUrls: ['./magazines.component.scss'],
})
export default class MagazinesComponent {
  #modalService = inject(NgbModal);

  open(content: TemplateRef<unknown>) {
    this.#modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
