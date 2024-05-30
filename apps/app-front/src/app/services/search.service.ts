import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SearchDTO } from '@dto';
import { Observable, catchError, of, tap } from 'rxjs';
import { env } from '../../environments/environment';
import { MagazineState, SearchType } from '../models/magazine.model';
import { AbstractState } from './abstract-state.class';

@Injectable({
  providedIn: 'root',
})
export class SearchService extends AbstractState<MagazineState> {
  #http = inject(HttpClient);
  loading = this.select('loading');
  uploading = this.select('uploading');
  results = this.select('results');

  constructor() {
    super({
      stateName: 'Magazine',
      defaultState: {
        uploading: false,
        loading: false,
        results: [],
      },
    });
  }

  searchMagazines(search: SearchType) {
    if (search.query && search.query.length > 3) {
      this.#searchMagazines(search);
    } else {
      this.cleanResults();
    }
  }

  uploadMagazine(formData: FormData): Observable<null> {
    this.update((state) => ({ ...state, uploading: true }));
    return this.#http.post<null>(env.api + '/upload', formData).pipe(
      tap(() => {
        this.update((state) => ({ ...state, uploading: false, magazines: [] }));
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.update((state) => ({ ...state, uploading: false }));
        return of();
      })
    );
  }

  cleanResults() {
    this.update((state) => ({ ...state, results: [] }));
  }

  #searchMagazines(query: SearchType) {
    this.update((state) => ({ ...state, loading: true }));
    this.#http
      .get<SearchDTO[]>(env.api + '/search', {
        params: Object.entries(query)
          .filter(([, value]) => value !== undefined && value !== null)
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
      })
      .subscribe({
        next: (results: SearchDTO[]) => {
          this.update((state) => ({ ...state, results, loading: false }));
        },
        error: (error) => {
          console.error(error);
          this.update((state) => ({ ...state, loading: false }));
        },
      });
  }
}
