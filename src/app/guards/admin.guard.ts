import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Login хийгээгүй бол
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Admin биш бол
  if (!auth.isAdmin()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
