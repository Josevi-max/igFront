import { inject, Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import { config } from '../../../config/config';
import { AuthManagementService } from '../../../core/state/auth/store/auth-management.service';
import { MessageStatus } from './models/chat.model';
import { ChatStoreService } from '../state/store/chat-store.service';

@Injectable({
  providedIn: 'root'
})
export class ChatRealtimeService {

  private echo!: Echo<'pusher'>;
  private readonly authService = inject(AuthManagementService);
  private readonly chatManagementService = inject(ChatStoreService);
  public connect(roomId: number) {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: config.pusher.key,
      cluster: config.pusher.cluster,
      auth: {
        headers: {
          Authorization: `Bearer ${this.authService.tokenValue()}`,
        },
      },
      authEndpoint: config.api.URL_BACKEND_BASE + '/broadcasting/auth',
    });

    return this.echo.join(`chat.${roomId}`);
  }

  public processStatusMessage(senderId: number): MessageStatus {
    let result = MessageStatus.DELIVERED
    if (senderId === this.authService.userDataValue()!.id) {
      result = MessageStatus.READ;
    }
    return result;
  }

  public disconnect() {
    this.echo?.disconnect();
  }

  public generateTempId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
