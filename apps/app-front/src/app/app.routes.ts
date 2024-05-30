import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: 'back-office',
    loadComponent: () => import('./pages/back-office/back-office.component'),
  },
];
