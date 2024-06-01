import { CommonModule } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { MagazineDTO } from '@dto';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MagazineService } from 'apps/app-front/src/app/services/magazine.service';
import { env } from 'apps/app-front/src/environments/environment';
import { Observable, map } from 'rxjs';
import { UploadComponent } from '../../../../components/upload/upload.component';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [CommonModule, UploadComponent, NgbTooltipModule],
  templateUrl: './magazines.component.html',
  styleUrls: ['./magazines.component.scss'],
})
export default class MagazinesComponent {
  #modalService = inject(NgbModal);
  #magazineService = inject(MagazineService);
  magazines$: Observable<MagazineDTO[]> = this.#magazineService
    .listMagazines()
    .pipe(map((res) => res.rows));
  #basePdf = env.pdfServer;
  open(content: TemplateRef<unknown>) {
    this.#modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  mazineImage(fileName: string | undefined) {
    if (!fileName) return '';
    const imageUrl = new URL(fileName, this.#basePdf);
    return imageUrl.href;
  }
}
