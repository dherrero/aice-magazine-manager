import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.scss'],
})
export default class BackOfficeComponent {}
