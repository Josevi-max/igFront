import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth/auth.guard';
import { HomeComponent } from './features/home/components/home/home.component';
import { NotFoundComponent } from './features/errors/components/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth-routing.module').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'chat',
        loadChildren: () => import('./features/chat/chat-routing.module').then(m => m.CHAT_ROUTES)
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
