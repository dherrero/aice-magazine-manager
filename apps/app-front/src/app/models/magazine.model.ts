import { SearchDTO } from '@dto';

export interface MagazineState {
  uploading: boolean;
  loading: boolean;
  results: SearchDTO[];
}
