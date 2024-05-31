import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  createUrlTreeFromSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const canActivateFn: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  return inject(AuthService).isLoggedIn$.pipe(
    map((isLoggedIn: boolean) =>
      isLoggedIn ? true : createUrlTreeFromSnapshot(next, ['/', 'login'])
    )
  );
};
