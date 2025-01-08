import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  let newUrl = state.url;
  const isLoggedIn = authenticationService.isLoggedIn();
  if (newUrl === "/login" || newUrl === "/register") {
    if (isLoggedIn) {
      router.navigate(['/dashboard']);
      return false;
    }
    else {
      return true;
    }
  }
  else if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
