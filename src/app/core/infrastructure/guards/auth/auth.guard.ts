import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthManagementService } from '../../../state/auth/store/auth-management.service';

export const AuthGuard: CanActivateFn = () => {
  const authManagement = inject(AuthManagementService);
  const router = inject(Router);

  if (authManagement.tokenValue()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};