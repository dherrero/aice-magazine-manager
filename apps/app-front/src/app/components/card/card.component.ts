import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { env } from '../../../environments/environment';
import { HideImageOnErrorDirectiveModule } from './error-image/error-image.directive';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule, HideImageOnErrorDirectiveModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) content!: string;
  @Input({ required: true }) pdfPath!: string;
  @Input({ required: true }) page!: number;
  @Input() frontPage!: string | undefined;

  pdfURL!: string;
  imageUrl!: string;
  #basePdf = env.pdfServer;

  ngOnInit(): void {
    const pdfURL = new URL(this.pdfPath, this.#basePdf);
    this.pdfURL = `${pdfURL.href}#page=${this.page}`;
    if (this.frontPage) {
      const imageUrl = new URL(this.frontPage, this.#basePdf);
      this.imageUrl = imageUrl.href;
    }
  }
}
