import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FilterhMagazineType } from '@dto';
import { SearchType } from '@front/app/models/magazine.model';
import {
  NgbAccordionModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    NgbTooltipModule,
    TranslocoModule,
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
    'filters.greaterThan',
    'filters.greaterThanEqual',
    'filters.lessThan',
    'filters.lessThanEqual',
    'filters.equal',
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
