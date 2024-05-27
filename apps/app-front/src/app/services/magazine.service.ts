import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SearchDTO } from '@dto';
import { Observable, catchError, of, tap } from 'rxjs';
import { env } from '../../environments/environment';
import { MagazineState } from '../models/magazine.model';
import { AbstractState } from './abstract-state.class';

@Injectable({
  providedIn: 'root',
})
export class MagazineService extends AbstractState<MagazineState> {
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

  searchMagazines(query: string) {
    this.update((state) => ({ ...state, loading: true }));
    this.#http
      .get<SearchDTO[]>(env.api + '/search', {
        params: { query },
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
}
