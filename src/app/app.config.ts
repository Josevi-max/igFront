import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importar animaciones
import { provideToastr } from 'ngx-toastr'; // Importar Toastr
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { sessionInterceptor } from './core/interceptors/session.interceptor';
import { errorInterceptiorInterceptor } from './core/interceptors/error-interceptior.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),provideHttpClient(withInterceptors([sessionInterceptor,errorInterceptiorInterceptor])),provideAnimations(),
    provideToastr(),]
};
