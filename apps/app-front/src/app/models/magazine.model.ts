export interface MagazineState {
  loading: boolean;
  magazines: Magazine[];
}

export interface Magazine {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  url: string;
}
