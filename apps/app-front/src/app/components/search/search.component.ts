import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterhMagazineType } from '@dto';
import {
  NgbAccordionModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { SearchType } from '../../models/magazine.model';

@UntilDestroy()
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbTooltipModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchValue = output<SearchType>();
  #fb = inject(FormBuilder);
  search = this.#fb.group({
    query: [''],
    type: [''],
    number: [''],
  });

  filtersOpen = false;

  typeOptions: number[] = Object.values(FilterhMagazineType).filter(
    (value) => typeof value === 'number'
  ) as unknown as number[];
  typeDescription = [
    'Mayor que',
    'Mayor o igual que',
    'Menor que',
    'Menor o igual que',
    'Igual a',
  ];

  ngOnInit() {
    this.search.valueChanges
      .pipe(
        untilDestroyed(this),
        filter(() => !this.filtersOpen)
      )
      .subscribe((value) => {
        if (value.query && value.query.length > 3) {
          this.searchValue.emit(value);
        } else {
          this.searchValue.emit({});
        }
      });
  }
  cleanQuery() {
    this.search.patchValue({ query: '', type: '', number: '' });
  }
  searchByFilters() {
    this.searchValue.emit(this.search.value);
  }
}
