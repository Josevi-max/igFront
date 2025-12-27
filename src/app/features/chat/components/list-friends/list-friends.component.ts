import { Component, inject, Signal, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthManagementService } from '../../../../core/state/auth/store/auth-management.service';
import { UserApiDto } from '../../infrastructure/models/chat-user.dto';
import { ChatStoreService } from '../../state/store/chat-store.service';

@Component({
  selector: 'app-list-friends',
  imports: [RouterModule],
  templateUrl: './list-friends.component.html',
  styleUrl: './list-friends.component.less'
})
export class ListFriendsComponent {

  public listUserChatted: Signal<UserApiDto[] | undefined> = signal(undefined);
  public usernameLogged: Signal<string | undefined> = signal(undefined);
  private readonly chatManagementService = inject(ChatStoreService);
  private readonly authManagementService = inject(AuthManagementService);
  constructor() {
    this.listUserChatted = this.chatManagementService.getListUserChatted();
    this.usernameLogged = signal(this.authManagementService.userDataValue()?.username);
  }

}
