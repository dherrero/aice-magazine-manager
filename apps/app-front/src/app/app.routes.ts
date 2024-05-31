import { Route } from '@angular/router';
import { canActivateFn } from './libs/auth/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: 'back-office',
    loadComponent: () => import('./pages/back-office/back-office.component'),
    canActivate: [canActivateFn],
    canActivateChild: [canActivateFn],
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
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component'),
  },
];
