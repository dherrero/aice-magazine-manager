import { SearchDTO } from '@dto';

export interface MagazineState {
  uploading: boolean;
  loading: boolean;
  results: SearchDTO[];
}

export type Nullable<T> = T | null;

export interface SearchType {
  query?: Nullable<string>;
  type?: Nullable<string>;
  number?: Nullable<string>;
}
