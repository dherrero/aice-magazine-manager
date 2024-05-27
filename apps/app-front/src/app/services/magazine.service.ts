import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PageDTO } from '@dto';
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
  pages = this.select('pages');

  constructor() {
    super({
      stateName: 'Magazine',
      defaultState: {
        uploading: false,
        loading: false,
        pages: [],
      },
    });
  }

  searchMagazines(query: string) {
    this.update((state) => ({ ...state, loading: true }));
    this.#http
      .get<PageDTO[]>(env.api + '/search', {
        params: { query },
      })
      .subscribe({
        next: (magazines: PageDTO[]) => {
          this.update((state) => ({ ...state, magazines, loading: false }));
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
