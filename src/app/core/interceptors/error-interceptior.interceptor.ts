import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../features/auth/services/auth/auth.service';

export const errorInterceptiorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error contiene un mensaje 'info' dentro de 'error.error', lo mostramos
      if (error.error && error.error.info) {
        toastr.info(error.error.info, 'Atención');
      }

      // Si la URL es 'auth/login', simplemente pasamos la solicitud
      if (['auth/login'].some(url => req.url.includes(url))) {
        return next(req);
      }

      // Manejo de estado 401 (No autorizado)
      if (error.status === 401) {
        authService.logout();
        toastr.info('Sesión caducada, redirigiendo al login', 'Atención');
        router.navigate(['auth/login']);
      }

      // Lanza el error para que el componente pueda manejarlo si es necesario
      return throwError(() => error);
    })
  );
};
