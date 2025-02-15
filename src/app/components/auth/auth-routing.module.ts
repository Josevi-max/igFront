import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
      }
    ]
  }
];
