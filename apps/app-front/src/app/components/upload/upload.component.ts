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

  selectedFile: File | null = null;
  publicationNumber = '';
  #magazineService = inject(MagazineService);

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (
      !this.selectedFile ||
      !this.publicationNumber ||
      isNaN(Number(this.publicationNumber))
    ) {
      alert('Please select a file and enter the publication number');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('publicationNumber', this.publicationNumber);

    this.#magazineService.uploadMagazine(formData).subscribe(() => {
      if (this.afterSave) {
        this.afterSave();
      }
    });
  }
}
