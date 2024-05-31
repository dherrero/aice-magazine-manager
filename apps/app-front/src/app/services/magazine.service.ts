import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MagazineDTO, SearchDTO } from '@dto';
import { Observable, catchError, of, tap } from 'rxjs';
import { env } from '../../environments/environment';
import { MagazineState, SearchType } from '../models/magazine.model';
import { AbstractState } from './abstract-state.class';

@Injectable({
  providedIn: 'root',
})
export class MagazineService extends AbstractState<MagazineState> {
  #http = inject(HttpClient);
  #pdfApi = 'pdf/';
  #magazineApi = 'magazine/';
  loading = this.select('loading');
  uploading = this.select('uploading');
  results = this.select('results');

  constructor() {
    super({
      stateName: 'Magazine',
      defaultState: {
        uploading: false,
        progressUpload: 0,
        loading: false,
        results: [],
      },
    });
  }

  listMagazines(page = 1, limit = 10) {
    return this.#http.get<MagazineDTO[]>(env.api + this.#magazineApi, {
      params: this.#setParams({ page, limit }),
    });
  }

  searchPdf(search: SearchType) {
    if (search.query && search.query.length > 3) {
      this.#searchPdf(search);
    } else {
      this.cleanResults();
    }
  }

  uploadPdf(formData: FormData, fileSize: number): Observable<unknown> {
    this.update((state) => ({ ...state, uploading: true }));
    return this.#http
      .post<null>(`${env.api}${this.#pdfApi}upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        tap((resp) => {
          if (resp.type === HttpEventType.Response) {
            this.update((state) => ({
              ...state,
              uploading: false,
              magazines: [],
            }));
          } else if (resp.type === HttpEventType.Sent) {
            this.update((state) => ({
              ...state,
              uploading: true,
              progressUpload: 0,
            }));
          } else if (resp.type === HttpEventType.UploadProgress) {
            const progressUpload = Math.round(
              (100 * resp.loaded) / (resp.total ?? fileSize)
            );
            this.update((state) => ({
              ...state,
              uploading: true,
              progressUpload,
            }));
          }
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

  #searchPdf(query: SearchType) {
    this.update((state) => ({ ...state, loading: true }));
    this.#http
      .get<SearchDTO[]>(`${env.api}${this.#pdfApi}search`, {
        params: this.#setParams(query as Record<string, string>),
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

  #setParams(params: Record<string, string | number>) {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }
}
