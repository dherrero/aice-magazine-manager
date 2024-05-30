import { Component, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadComponent } from '../../components/upload/upload.component';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [UploadComponent],
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.scss'],
})
export default class BackOfficeComponent {
  #modalService = inject(NgbModal);

  open(content: TemplateRef<unknown>) {
    this.#modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
