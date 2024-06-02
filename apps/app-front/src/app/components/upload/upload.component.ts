import { CommonModule } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MagazineService } from '@front/app/services/magazine.service';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbProgressbarModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @Output() afterSave = new EventEmitter();
  @Output() afterError = new EventEmitter();

  selectedFile: File | null = null;
  publicationNumber = '';
  publhishedAt = '';
  #magazineService = inject(MagazineService);
  uploadig = this.#magazineService.select('uploading');
  progressUpload = this.#magazineService.select('progressUpload');

  onFileSelected(event: Event) {
    const { files } = event.currentTarget as HTMLInputElement;
    if (files) this.selectedFile = files[0];
  }

  onUpload() {
    if (
      !this.selectedFile ||
      !this.publicationNumber ||
      isNaN(Number(this.publicationNumber)) ||
      !this.publhishedAt
    ) {
      alert('Todos los campos son requeridos');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('publicationNumber', this.publicationNumber);
    formData.append('publhishedAt', this.publhishedAt);

    this.#magazineService
      .uploadPdf(formData, this.selectedFile.size)
      .subscribe({
        next: (resp: unknown) => {
          if ((resp as HttpEvent<unknown>)?.type === HttpEventType.Response) {
            this.afterSave.emit();
          }
        },
        error: (error) => {
          this.afterError.emit(error);
        },
      });
  }
}
