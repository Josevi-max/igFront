import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ListFriendsComponent } from '../list-friends/list-friends.component';

@Component({
  selector: 'app-chat-home',
  imports: [CommonModule,
    HeaderComponent,
    ListFriendsComponent
  ],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.less'
})
export class ChatHomeComponent {

}
