import { CommonModule } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MagazineDTO } from '@dto';
import { HideImageOnErrorDirectiveModule } from '@front/app/components/card/error-image/error-image.directive';
import { ConfirmComponent } from '@front/app/components/confirm/confirm.component';
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
    ConfirmComponent,
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
    const modalRef = this.#modalService.open(ConfirmComponent);
    modalRef.componentInstance.title = 'Delete Magazine';
    modalRef.componentInstance.message =
      'Are you sure you want to delete this magazine?';
    modalRef.componentInstance.confirmText = 'Delete';
    modalRef.componentInstance.cancelText = 'Cancel';
    modalRef.componentInstance.openModal = true;
    modalRef.componentInstance.confirm
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        console.log('delete', magazine);
      });
  }
}
