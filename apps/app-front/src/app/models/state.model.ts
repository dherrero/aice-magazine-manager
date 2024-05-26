export interface StateConfig<T> {
  stateName: string;
  defaultState: T;
  reducers?: Map<string, (state: T, payload: unknown) => T>;
  storageApi?: keyof Window & ('localStorage' | 'sessionStorage');
  modelMapper?: (state: Partial<T>) => T;
}
