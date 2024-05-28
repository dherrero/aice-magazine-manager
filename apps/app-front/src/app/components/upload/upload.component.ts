import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MagazineService } from '../../services/magazine.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @Input() afterSave!: () => void;
  @Input() afterError!: () => void;

  selectedFile: File | null = null;
  publicationNumber = '';
  publhishedAt = '';
  #magazineService = inject(MagazineService);

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

    this.#magazineService.uploadMagazine(formData).subscribe({
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
