import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/chat-home/chat-home.component').then(m => m.ChatHomeComponent)

      },
      {
        path: ':id',
        loadComponent: () => import('./components/chat-room/chat-room.component').then(m => m.ChatRoomComponent)
      }
    ]
  }
];
