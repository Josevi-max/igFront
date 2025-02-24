import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { ChatService } from '../../../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ListFriendsComponent } from '../list-friends/list-friends.component';

@Component({
  selector: 'app-chat-room',
  imports: [
    CommonModule,
    HeaderComponent,
    ListFriendsComponent
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.less'
})
export class ChatRoomComponent implements OnInit {

  constructor(private _chatService: ChatService, private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    const idFriend = this.route.snapshot.paramMap.get('id');
  }
}
