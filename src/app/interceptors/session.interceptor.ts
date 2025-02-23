import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {

  const authData = inject(AuthService);
  const token = authData.token();
  const excludedUrls = ['/auth/register', '/auth/login', '/auth/forgot-password'];

  if (excludedUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(cloned);
};
