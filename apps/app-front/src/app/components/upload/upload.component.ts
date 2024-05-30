import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbProgressbarModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @Input() afterSave!: () => void;
  @Input() afterError!: () => void;

  selectedFile: File | null = null;
  publicationNumber = '';
  publhishedAt = '';
  #magazineService = inject(SearchService);
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
      .uploadMagazine(formData, this.selectedFile.size)
      .subscribe({
        next: () => {
          if (this.afterSave) {
            this.afterSave();
          }
        },
        error: (error) => {
          if (this.afterError) {
            this.afterError();
          }
          console.error(error);
        },
      });
  }
}
