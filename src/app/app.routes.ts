import { Routes } from '@angular/router';
import { AuthGuard } from './core/infrastructure/guards/auth/auth.guard';
import { HomeComponent } from './features/home/components/home/home.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { homeResolver } from './features/home/resolvers/home.resolver';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            homeData: homeResolver
        },
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
