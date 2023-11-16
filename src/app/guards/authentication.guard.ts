import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const currentUser = authenticationService.getCurrentUser();
  if (currentUser) {
    if (currentUser.emailVerified) {
      return true;
    }
  }
  return router.parseUrl('/login');
};
