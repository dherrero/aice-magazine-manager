import { PageDTO } from '@dto';

export interface MagazineState {
  uploading: boolean;
  loading: boolean;
  pages: PageDTO[];
}
