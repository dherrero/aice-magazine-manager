import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { env } from '../../environments/environment';
import { Magazine, MagazineState } from '../models/magazine.model';
import { AbstractState } from './abstract-state.class';

@Injectable({
  providedIn: 'root',
})
export class MagazineService extends AbstractState<MagazineState> {
  #http = inject(HttpClient);
  loading = this.select('loading');
  magazines = this.select('magazines');

  constructor() {
    super({
      stateName: 'Magazine',
      defaultState: {
        loading: false,
        magazines: [],
      },
    });
  }

  searchMagazines(query: string) {
    this.update((state) => ({ ...state, loading: true }));
    this.#http
      .get<Magazine[]>(env.api + '/magazines', {
        params: { query },
      })
      .subscribe({
        next: (magazines: Magazine[]) => {
          this.update((state) => ({ ...state, magazines, loading: false }));
        },
        error: (error) => {
          console.error(error);
          this.update((state) => ({ ...state, loading: false }));
        },
      });
  }
}
