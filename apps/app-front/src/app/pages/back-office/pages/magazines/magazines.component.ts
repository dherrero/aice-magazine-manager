import { CommonModule } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { MagazineDTO } from '@dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MagazineService } from 'apps/app-front/src/app/services/magazine.service';
import { Observable } from 'rxjs';
import { UploadComponent } from '../../../../components/upload/upload.component';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [CommonModule, UploadComponent],
  templateUrl: './magazines.component.html',
  styleUrls: ['./magazines.component.scss'],
})
export default class MagazinesComponent {
  #modalService = inject(NgbModal);
  #magazineService = inject(MagazineService);
  magazines$: Observable<MagazineDTO[]> = this.#magazineService.listMagazines();

  open(content: TemplateRef<unknown>) {
    this.#modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
