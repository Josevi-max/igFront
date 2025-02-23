import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../errors/not-found/not-found.component';

const routes: Routes = [];

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./chat-home/chat-home.component').then(m => m.ChatHomeComponent)

      },
      {
        path: ':id',
        loadComponent: () => import('./chat-room/chat-room.component').then(m => m.ChatRoomComponent)
      }
    ]
  }
];
