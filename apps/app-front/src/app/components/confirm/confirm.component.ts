import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [NgbModalModule],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input({ required: true }) confirmText!: string;
  @Input() cancelText!: string;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
