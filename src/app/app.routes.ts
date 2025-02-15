import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { provideRouter } from '@angular/router';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'auth',
        loadChildren: () => import('./components/auth/auth-routing.module').then(m => m.AUTH_ROUTES)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
