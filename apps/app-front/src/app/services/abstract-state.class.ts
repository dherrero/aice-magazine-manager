import {
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';

import { StateConfig } from '../models/state.model';

/**
 * Abstract class for managing states with or without reducers
 *
 * @template T - state type
 * @param {StateConfig<T>} options - configuration object
 */
export abstract class AbstractState<T> {
  private readonly _state!: WritableSignal<T>;

  private _window: Window = window;

  private _stateName: StateConfig<T>['stateName'];
  private _defaultState: T;
  private _reducers!: StateConfig<T>['reducers'];
  private _storageApi: StateConfig<T>['storageApi'];
  private _storageKey: string;
  private _mapper!: StateConfig<T>['modelMapper'];

  constructor(options: StateConfig<T>) {
    this._reducers = options?.reducers;
    this._stateName = options.stateName;
    this._defaultState = options.defaultState;
    this._storageApi = options.storageApi;
    this._storageKey = `State_${this._stateName}`;
    if (options.modelMapper) {
      this._mapper = options.modelMapper;
    }
    this._state = signal<T>(this._getCache());

    effect(() => {
      this._cacheState(this._state());
    });
  }
  /**
   * Select a value from the state or the whole state
   *
   * @param [key] - key of the value to select or empty to select the whole state
   * @returns Signal<T> | Signal<T[K]>
   */
  select(): Signal<T>;
  select<K extends keyof T>(key: K): Signal<T[K]>;
  select<K extends keyof T>(key?: keyof T): Signal<T> | Signal<T[K]> {
    if (key) {
      return computed(() => this._state()[key]) as Signal<T[K]>;
    }
    return computed(() => this._state()) as Signal<T>;
  }

  /**
   * Get a value from the state or the whole state
   *
   * @param [key] - key of the value to select or empty to select the whole state
   * @returns T | T[K]
   */
  get(): T;
  get<K extends keyof T>(key: K): T[K];
  get<K extends keyof T>(key?: keyof T): T | T[K] {
    if (key) {
      return this._state()[key] as T[K];
    }
    return this._state() as T;
  }

  /**
   * Dispatch an action to update the state
   *
   * @param {string} action - action name
   * @param {unknown} payload - payload to pass to the reducer
   */
  dispatch(action: string, payload: unknown): void {
    const reducer = this._reducers?.get(action);
    if (!reducer)
      throw new Error(`Error action ${action} not found in reducers Map`);
    this._state.set(reducer(this.get(), payload));
  }

  /**
   * Clear the cache
   */
  clearCache() {
    if (this._storageApi) {
      this._window[this._storageApi].removeItem(this._storageKey);
    }
  }

  /**
   * Update the state with a new value
   *
   * @param {Function} updateFn - function that takes the current state and returns a new state
   */
  protected update(updateFn: (value: T) => T) {
    this._state.update(updateFn);
  }

  private _cacheState(state: T) {
    if (this._storageApi) {
      this._window[this._storageApi].setItem(
        this._storageKey,
        JSON.stringify(state)
      );
    }
  }

  private _getCache(): T {
    let cache = this._defaultState;
    if (this._storageApi) {
      cache =
        this._parse<T>(
          this._window[this._storageApi].getItem(this._storageKey)
        ) || this._defaultState;
    }
    return this._mapper ? this._mapper(cache) : cache;
  }

  private _parse<S>(objStr: string | null): S | null {
    return objStr !== null ? (JSON.parse(objStr) as S) : objStr;
  }
}
