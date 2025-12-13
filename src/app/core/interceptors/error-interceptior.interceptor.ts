import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthFacadeService } from "../state/auth/facade/auth-facade.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, throwError } from "rxjs";

export const errorInterceptiorInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacadeService = inject(AuthFacadeService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (req.url.includes('auth/login')) {
        return throwError(() => error);
      }

      const message = error.error?.info ?? 'Ha ocurrido un error inesperado';
      toastr.info(message, 'Atención');

      if (error.status === 401) {
        authFacadeService.logout();
        toastr.info('Sesión caducada, redirigiendo al login', 'Atención');
        router.navigate(['auth/login']);
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
