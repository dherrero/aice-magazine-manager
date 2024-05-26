import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MagazineService } from '../../services/magazine.service';

@UntilDestroy()
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent implements OnInit {
  #fb = inject(FormBuilder);
  magazineService = inject(MagazineService);

  search = this.#fb.group({
    query: [''],
  });

  ngOnInit() {
    this.search.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value.query && value.query.length > 3) {
        this.magazineService.searchMagazines(value.query);
      }
    });
  }
}
