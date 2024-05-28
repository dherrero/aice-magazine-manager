import { Component, Input, OnInit } from '@angular/core';
import { env } from '../../../environments/environment';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) content!: string;
  @Input({ required: true }) pdfPath!: string;
  @Input({ required: true }) page!: number;

  pdfURL!: string;

  #basePdf = env.pdfServer;

  ngOnInit(): void {
    const pdfURL = new URL(this.pdfPath, this.#basePdf);
    this.pdfURL = `${pdfURL.href}#page=${this.page}`;
  }
}
