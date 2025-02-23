import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptiorInterceptor: HttpInterceptorFn = (req, next) => {
  var authService = inject(AuthService);
  var router = inject(Router);
  var toastr = inject(ToastrService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (['auth/login'].some(url => req.url.includes(url))) {
        return next(req);
      }
      if (error.status === 401) {
        authService.logout();
        toastr.info('Sesión caducada redirigiendo al login', 'Atención');
        router.navigate(['auth/login']);
      }
      return throwError(error);
    })
  );
};
