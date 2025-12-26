import { inject, Injectable } from '@angular/core';
import { ChatApiService } from '../../infrastructure/api/chat-api.service';
import { take, timeout } from 'rxjs';
import { ChatStoreService } from '../store/chat-store.service';
import { ChatRealtimeService } from '../../domain/chat-realtime.service';
import { AuthManagementService } from '../../../../core/state/auth/store/auth-management.service';
import { ChannelsListened, MessageStatus } from '../../domain/models/chat.model';
import { Message } from '../../models/message/messages';

@Injectable({
  providedIn: 'root'
})
export class ChatFacadeService {

  private readonly chatApiService = inject(ChatApiService);
  private readonly chatStoreService = inject(ChatStoreService);
  private readonly chatRealtimeService = inject(ChatRealtimeService);
  private readonly auth = inject(AuthManagementService);

  public loadInfoUserChat(idUser: number): void {
    this.chatApiService.getInfoUserChat(idUser).pipe(take(1)).subscribe(
      (user) => {
        debugger;
        this.chatStoreService.setDataFriend(user);
      }
    );
  }

  public loadRoomOrCreateIfNotExists(idUser: number): void {
    this.chatApiService.getOrCreateRoom(idUser).pipe(take(1)).subscribe(
      (response) => {
        this.chatStoreService.setRoomId(response.data['roomId']);
        this.joinToRoom();
      }
    );
  }

  public joinToRoom(): void {
    const roomId = this.chatStoreService.getRoomId()();
    const channel = this.chatRealtimeService.connect(roomId);
    channel.listen(`.${ChannelsListened.NEW_MESSAGE}`, (data: any) => {
      const status = this.chatRealtimeService.processStatusMessage(data);
      this.chatApiService.changeStatusMessage(status, data.chat.id).pipe(take(1)).subscribe();
      debugger;
      if(data.chat.sender_id != this.auth.userDataValue()!.id){
        this.chatStoreService.addMessage(data.chat);
      }else{
        this.chatStoreService.updateStatusMessage(data.chat,status);
      }
    });
    channel.listen(`.${ChannelsListened.USER_TYPING}`, (data: any) => {
      debugger;
      if (data.idUserTyping != this.auth.userDataValue()!.id) {
        this.chatStoreService.setShowTypingGif(JSON.parse(data.isTyping));
      }
    });
    channel.here((users: any) => {
      if (users.length > 1) {
        this.chatApiService.changeStatusMessage(MessageStatus.READ).pipe(take(1)).subscribe();
      }
    });
    channel.joining((user: any) => {
      this.chatStoreService.incrementUsersInRoom();
      this.chatApiService.changeStatusMessage(MessageStatus.READ).pipe(take(1)).subscribe();
    });
    channel.leaving((user: any) => {
      this.chatStoreService.decrementUsersInRoom();
    });
  }

  public leaveRoom(): void {
    this.chatRealtimeService.disconnect();
  }

  public leacheChatRoom(): void {
    const echo = this.chatStoreService.getEcho()();
    const roomIdStore = this.chatStoreService.getRoomId()();
    echo!.leaveChannel(`${ChannelsListened.CHAT}.${roomIdStore}`);
  }

  public updateTypingStatus(isUserTyping: boolean): void {
    const roomId = this.chatStoreService.getRoomId()();
    this.chatStoreService.setIsTyping(isUserTyping);
    this.chatApiService.sendTypingEvent(roomId, isUserTyping, this.auth.userDataValue()!.id).pipe(take(1)).subscribe();
  }

  public getListMessages(idUser2: number): void {
    debugger;
    this.chatApiService.getMessagesChat(idUser2).pipe(take(1)).subscribe(
      (response) => {
        this.chatStoreService.setMessages(response.response);
      }
    );
  }

  public createMessage(myMessage: string): void {
    const tempId = this.chatRealtimeService.generateTempId();
    const receiverId = this.chatStoreService.getDataFriend()()?.data.id!;
    this.chatRealtimeService.addMyMessageToChatList(myMessage, receiverId, tempId);
    this.chatApiService.sendMessage(myMessage, receiverId, tempId).pipe(take(1)).subscribe();
  }
}