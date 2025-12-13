import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat/chat.service';
import { take } from 'rxjs';
import { AuthManagementService } from '../../../../core/state/auth/store/auth-management.service';

@Component({
  selector: 'app-list-friends',
  imports: [JsonPipe, RouterModule],
  templateUrl: './list-friends.component.html',
  styleUrl: './list-friends.component.less'
})
export class ListFriendsComponent {

  listUserChatted = signal<any>({});
  constructor(public auth: AuthManagementService, private _chatService: ChatService) {
    this._chatService.getDataUserChatted().pipe(
      take(1)
    ).subscribe({
      next: (response) => {
        this.listUserChatted.set(response.data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

}
