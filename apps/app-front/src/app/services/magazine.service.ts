import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { MagazineDTO, PaginationDTO, SearchDTO } from '@dto';
import { MagazineState, SearchType } from '@front/app/models/magazine.model';
import { env } from '@front/environments/environment';
import { Observable, Subject, catchError, of, takeUntil, tap } from 'rxjs';
import { AbstractState } from './abstract-state.class';

@Injectable({
  providedIn: 'root',
})
export class MagazineService
  extends AbstractState<MagazineState>
  implements OnDestroy
{
  #http = inject(HttpClient);
  #pdfApi = 'pdf/';
  #magazineApi = 'magazine/';
  #searchCancel$ = new Subject<void>();
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
    return this.#http.get<PaginationDTO<MagazineDTO>>(
      env.api + this.#magazineApi + 'paged',
      {
        params: this.#setParams({ page, limit }),
      }
    );
  }

  searchPdf(search: SearchType) {
    // Cancelar búsqueda anterior
    this.#searchCancel$.next();

    if (search.query && search.query.length > 3) {
      this.#searchPdf(search);
    } else {
      this.cleanResults();
      // Asegurar que el estado de carga se resetee
      this.update((state) => ({ ...state, loading: false }));
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
      .pipe(takeUntil(this.#searchCancel$))
      .subscribe({
        next: (results: SearchDTO[]) => {
          this.update((state) => ({ ...state, results, loading: false }));
        },
        error: (error) => {
          // Solo mostrar error si no fue cancelado
          if (error.name !== 'AbortError' && error.name !== 'TimeoutError') {
            console.error('Error en búsqueda:', error);
            this.update((state) => ({
              ...state,
              loading: false,
              results: [], // Limpiar resultados en caso de error
            }));
          } else {
            // Si fue cancelado, solo resetear loading sin limpiar resultados
            this.update((state) => ({ ...state, loading: false }));
          }
        },
      });
  }

  #setParams(params: Record<string, string | number>) {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  ngOnDestroy() {
    // Cancelar todas las búsquedas pendientes
    this.#searchCancel$.next();
    this.#searchCancel$.complete();
  }
}
