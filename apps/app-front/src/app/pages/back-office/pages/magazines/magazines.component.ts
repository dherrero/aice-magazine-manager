import { CommonModule } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MagazineDTO } from '@dto';
import { HideImageOnErrorDirectiveModule } from '@front/app/components/card/error-image/error-image.directive';
import { ConfirmModule } from '@front/app/components/confirm/confirm.module';
import { ConfirmService } from '@front/app/components/confirm/confirm.service';
import { UploadComponent } from '@front/app/components/upload/upload.component';
import { MagazineService } from '@front/app/services/magazine.service';
import { env } from '@front/environments/environment';
import {
  NgbModal,
  NgbModalRef,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';

interface StatusListView {
  page: number;
  pageSize: number;
  loading: boolean;
  search?: string;
}

@UntilDestroy()
@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [
    CommonModule,
    UploadComponent,
    ConfirmModule,
    FormsModule,
    HideImageOnErrorDirectiveModule,
    NgbTooltipModule,
    NgbPaginationModule,
  ],
  templateUrl: './magazines.component.html',
  styleUrls: ['./magazines.component.scss'],
})
export default class MagazinesComponent {
  collectionSize = 0;

  get page() {
    return this.#magazineViewStatus.value.page;
  }
  set page(page: number) {
    this.#magazineViewStatus.next({ ...this.#magazineViewStatus.value, page });
  }

  get pageSize() {
    return this.#magazineViewStatus.value.pageSize;
  }
  set pageSize(pageSize: number) {
    this.#magazineViewStatus.next({
      ...this.#magazineViewStatus.value,
      pageSize,
    });
  }

  #basePdf = env.pdfServer;
  #modalService = inject(NgbModal);
  #magazineService = inject(MagazineService);
  #magazineViewStatus = new BehaviorSubject<StatusListView>({
    page: 1,
    pageSize: 5,
    loading: false,
  });
  #magazineViewStatus$ = this.#magazineViewStatus.asObservable();
  magazines$: Observable<MagazineDTO[]> = this.#magazineViewStatus$.pipe(
    untilDestroyed(this),
    switchMap((status) =>
      this.#magazineService.listMagazines(status.page, status.pageSize).pipe(
        map((res) => {
          this.collectionSize = res.count;
          return res.rows;
        })
      )
    )
  );
  #ngbModalRef: NgbModalRef | undefined;
  #confirmService = inject(ConfirmService);

  open(content: TemplateRef<unknown>) {
    this.#ngbModalRef = this.#modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    });
  }

  mazineImage(fileName: string | undefined) {
    if (!fileName) return '';
    const imageUrl = new URL(fileName, this.#basePdf);
    return imageUrl.href;
  }

  onUploadSuccess() {
    this.#ngbModalRef?.close();
    this.page = 1;
  }

  onUploadError(error: unknown) {
    console.error(error);
  }

  openPdf(pdfPath: string) {
    const pdfURL = new URL(pdfPath, this.#basePdf);
    window.open(pdfURL.href, '_blank');
  }

  confirmDelete(magazine: MagazineDTO) {
    this.#confirmService
      .open({
        title: 'Eliminar revista ' + magazine.number,
        message:
          '¿Estás seguro de que deseas eliminar la revista y todas sus páginas?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirm) => {
        if (confirm) {
          console.log('delete', magazine);
        }
      });
  }
}
