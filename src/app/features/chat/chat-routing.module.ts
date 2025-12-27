import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { chatRoomResolver } from './resolvers/chat-room.resolver';
import { listFriendsResolver } from './resolvers/list-friends.resolver';

const routes: Routes = [];

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/chat-home/chat-home.component').then(m => m.ChatHomeComponent),
        resolve: {
          listFriends: listFriendsResolver
        }

      },
      {
        path: ':id',
        loadComponent: () => import('./components/chat-room/chat-room.component').then(m => m.ChatRoomComponent),
        resolve: {
          chatRoom: chatRoomResolver
        }
      }
    ]
  }
];
