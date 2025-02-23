import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { AuthGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./components/auth/auth-routing.module').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'chat',
        loadChildren: () => import('./components/chat/chat-routing.module').then(m => m.CHAT_ROUTES)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
