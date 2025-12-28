import { inject, Injectable } from '@angular/core';
import { ChatApiService } from '../../infrastructure/api/chat-api.service';
import { take } from 'rxjs';
import { ChatStoreService } from '../store/chat-store.service';
import { ChatRealtimeService } from '../../infrastructure/realtime/chat-realtime.service';
import { AuthManagementService } from '../../../../core/state/auth/store/auth-management.service';
import { MessageStatus } from '../../domain/models/chat.model';
import { UserApi } from '../../../../core/infrastructure/api/auth/auth-response.dto';
import { NewMessageApiDto, TypingResponse, ChannelsListened, Message } from '../../infrastructure/models/chat-user.dto';
import { UiStoreService } from '../../../../core/state/ui/store/ui-store.service';

@Injectable({
  providedIn: 'root'
})
export class ChatFacadeService {


  private readonly chatApiService = inject(ChatApiService);
  private readonly chatStoreService = inject(ChatStoreService);
  private readonly chatRealtimeService = inject(ChatRealtimeService);
  private readonly uiStoreService = inject(UiStoreService);
  private readonly autmanagementService = inject(AuthManagementService);
  private readonly auth = inject(AuthManagementService);

  get userId(): number {
    return this.autmanagementService.userDataValue()!.id;
  }

  public loadInfoUserChat(idUser: number): void {
    this.uiStoreService.setIsLoading(true);
    this.chatApiService.getInfoUserChat(idUser).pipe(take(1)).subscribe(
      (user) => {
        this.chatStoreService.setDataFriend(user);
        this.uiStoreService.setIsLoading(false);
      }
    );
  }

  public loadRoomOrCreateIfNotExists(idUser: number): void {
    this.chatApiService.getOrCreateRoom(idUser,this.userId).pipe(take(1)).subscribe(
      (response) => {
        if(response.data){
          this.chatStoreService.setRoomId(response.data['roomId']);
          this.joinToRoom();
        }
      }
    );
  }

  public joinToRoom(): void {
    const roomId = this.chatStoreService.getRoomId()();
    const channel = this.chatRealtimeService.connect(roomId);
    channel.listen(`.${ChannelsListened.NEW_MESSAGE}`, (data: NewMessageApiDto) => {
      const status = this.chatRealtimeService.processStatusMessage(data.chat.sender_id);
      this.chatApiService.changeStatusMessage(status, data.chat.id).pipe(take(1)).subscribe();
      if(data.chat.sender_id != this.auth.userDataValue()!.id){
        this.chatStoreService.addMessage(data.chat);
      }else{
        this.chatStoreService.updateStatusMessage(data.chat,status);
      }

    });
    channel.listen(`.${ChannelsListened.USER_TYPING}`, (data: TypingResponse) => {
      if (data.idUserTyping != this.auth.userDataValue()!.id) {
        this.chatStoreService.setShowTypingGif(data.isTyping);
      }
    });
    channel.here((users: UserApi[]) => {
      if (users.length > 1) {
        this.chatApiService.changeStatusMessage(MessageStatus.READ).pipe(take(1)).subscribe();
      }
    });
    channel.joining(() => {
      this.chatStoreService.incrementUsersInRoom();
      this.chatApiService.changeStatusMessage(MessageStatus.READ).pipe(take(1)).subscribe();
    });
    channel.leaving(() => {
      this.chatStoreService.decrementUsersInRoom();
    });
  }

  public leaveRoom(): void {
    this.chatRealtimeService.disconnect();
  }

  public updateTypingStatus(isUserTyping: boolean): void {
    const roomId = this.chatStoreService.getRoomId()();
    this.chatStoreService.setIsTyping(isUserTyping);
    this.chatApiService.sendTypingEvent(roomId, isUserTyping, this.auth.userDataValue()!.id).pipe(take(1)).subscribe();
  }

  public getListMessages(idUser2: number): void {
    this.chatApiService.getMessagesChat(idUser2).pipe(take(1)).subscribe(
      (response) => {
        if(response.data){
          this.chatStoreService.setMessages(response.data);
        }
      }
    );
  }

  public createMessage(myMessage: string): void {
    const tempId = this.chatRealtimeService.generateTempId();
    const receiverId = this.chatStoreService.getDataFriend()()?.data!.id!;
    this.addMyMessageToChatList(myMessage, receiverId, tempId);
    this.chatApiService.sendMessage(myMessage, receiverId, tempId, this.userId).pipe(take(1)).subscribe();
  }

  public getDataUserChatted(): void {
    this.chatApiService.getDataUserChatted(this.userId).pipe(take(1)).subscribe(
      (response) => {
        debugger;
        this.chatStoreService.setListUserChatted(response.data);
      }
    );
  }

  private addMyMessageToChatList(message: string, receiverId: number, tempId: string): void {
    const chat: Message = {
      id: Date.now(),
      tempId: tempId,
      message: message,
      sender_id: this.auth.userDataValue()!.id,
      receiver_id: receiverId,
      status: MessageStatus.SENT,
      read_at: '',
      created_at: new Date().toString(),
      updated_at: new Date().toString()
    }
    this.chatStoreService.addMessage(chat);
  }
}