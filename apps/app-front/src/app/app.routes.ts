import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: 'back-office',
    loadComponent: () => import('./pages/back-office/back-office.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/back-office/pages/magazines/magazines.component'),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/back-office/pages/users/users.component'),
      },
    ],
  },
];
