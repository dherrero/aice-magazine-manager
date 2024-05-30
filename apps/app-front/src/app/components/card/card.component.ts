import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { env } from '../../../environments/environment';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
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
    if (this.frontPage)
      this.imageUrl = this.frontPage.replace('/home/app-back/', this.#basePdf);
  }
}
