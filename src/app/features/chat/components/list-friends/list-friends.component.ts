import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-list-friends',
  imports: [JsonPipe,RouterModule],
  templateUrl: './list-friends.component.html',
  styleUrl: './list-friends.component.less'
})
export class ListFriendsComponent {

  listUserChatted = signal<any>({});
  constructor(public auth:AuthService, private _chatService:ChatService){
    this._chatService.getDataUserChatted().subscribe({
      next:(response)=>{
        this.listUserChatted.set(response.data);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  
}
