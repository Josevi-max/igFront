import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal, Signal, effect, OnDestroy, WritableSignal, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListFriendsComponent } from '../list-friends/list-friends.component';
import { FormsModule } from '@angular/forms';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import { take, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { ChatService } from '../../services/chat/chat.service';
import { Message } from '../../models/message/messages';
import { config } from '../../../../config/config';
import { User } from '../../../../core/domain/auth/models/auth.model';
import { AuthManagementService } from '../../../../core/state/auth/store/auth-management.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatFacadeService } from '../../state/facade/chat-facade.service';
import { ChatStoreService } from '../../state/store/chat-store.service';
import { ApiResponseDto, UserApiDto } from '../../infrastructure/models/chat-user.dto';
import { MessageStatus } from '../../domain/models/chat.model';
@Component({
  selector: 'app-chat-room',
  imports: [
    CommonModule,
    HeaderComponent,
    ListFriendsComponent,
    FormsModule,
    SpinnerComponent
  ],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.less',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatRoomComponent implements OnDestroy {

  public auth = inject(AuthManagementService);
  public textMessage: string = '';
  public loading: boolean = false;
  public messages: Signal<Message[]> = signal([]);
  public isTyping: Signal<boolean> = signal(false);
  public dataFriend: Signal<ApiResponseDto<UserApiDto> | undefined> = signal(undefined);
  public echo: Echo<'pusher'> | undefined = undefined;
  public usersInRoom: Signal<number> = signal(1);
  public showTypingGif: Signal<boolean> = signal(false);
  public showEmoyiPicker: WritableSignal<boolean> = signal(false);
  public MessageStatus = MessageStatus;
  private readonly chatFacadeService = inject(ChatFacadeService);
  private readonly chatmanagementService = inject(ChatStoreService);
  private readonly route = inject(ActivatedRoute);
  private typingTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly TYPING_INACTIVITY_MS = 2000;

  constructor() {
    this.isTyping = this.chatmanagementService.getIsTyping();
    this.dataFriend = this.chatmanagementService.getDataFriend();
    this.messages = this.chatmanagementService.getMessages();
    this.showTypingGif = this.chatmanagementService.getShowTypingGif();
    this.usersInRoom = this.chatmanagementService.getUsersInRoom();

    this.route.params.pipe(
      take(1)
    )
      .subscribe(
        params => {
          const idFriend = params['id'];
          this.chatFacadeService.loadInfoUserChat(idFriend);
          this.chatFacadeService.getListMessages(idFriend);
          this.chatFacadeService.loadRoomOrCreateIfNotExists(idFriend);
        }
      );
  }

  ngOnDestroy(): void {
    this.chatFacadeService.leacheChatRoom();
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
      this.chatFacadeService.updateTypingStatus(false);
    }
    // if (this.echo) {
    //   this.echo.leaveChannel(`chat.${this.roomId}`);
    // }
  }

  onInput() {
    if (!this.isTyping()) {
      this.chatFacadeService.updateTypingStatus(true);
    }
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    this.typingTimer = setTimeout(() => {
      this.chatFacadeService.updateTypingStatus(false);
      this.typingTimer = null;
    }, this.TYPING_INACTIVITY_MS);
  }


  // joinRoom() {
  //   this.chatFacadeService.joinToRoom();
  // console.log(this.messages());
  // Pusher.logToConsole = true;
  // let channelName = `chat.${this.roomId}`;
  // this.echo = new Echo({
  //   broadcaster: 'pusher',
  //   key: config.pusher.key,
  //   cluster: config.pusher.cluster,
  //   auth: {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('token')}`,
  //     },
  //   },
  //   authEndpoint: config.api.URL_BACKEND_BASE + '/broadcasting/auth',
  // });

  // const channel = this.echo.join(channelName);

  // channel.listen('.new-chat-message', (data: any) => {
  //   if (this.usersInRoom > 1) {
  //     data['chat'].status = 'read';
  //   } else {
  //     data['chat'].status = 'delivered';
  //   }
  //   if (data['chat'].sender_id === this.auth.userDataValue()!.id) {
  //     this.updateListMessage(data['chat'], true);
  //   } else {
  //     this.updateListMessage(data['chat']);
  //   }

  //   this._chatService.changeStatusMessage(data['chat'].status, data['chat'].id).pipe(
  //     take(1)
  //   ).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //     }, (error) => {
  //       console.log(error);
  //     }
  //   )
  // });
  // channel.listen('.user-typing', (data: any) => {
  //   debugger;
  //   if (data.idUserTyping != this.auth.userDataValue()!.id) {
  //     this.showTypingGif = data.isTyping;
  //   }
  // });
  // channel.here((users: any[]) => {
  //   this.usersInRoom = users.length;
  //   if (this.usersInRoom > 1) {
  //     this._chatService.changeStatusMessage('read').pipe(
  //       take(1)
  //     ).subscribe(
  //       (data: any) => {
  //         console.log(data);
  //       }, (error) => {
  //         console.log(error);
  //       }
  //     )
  //   }
  //   console.log('Usuarios conectados:', users);
  // });

  // channel.joining((user: any) => {
  //   this.usersInRoom++;
  //   this._chatService.changeStatusMessage('read').pipe(
  //     take(1)
  //   ).subscribe(
  //     (data: any) => {
  //       console.log(data);
  //     }, (error) => {
  //       console.log(error);
  //     }
  //   )
  //   console.log('Usuario uniéndose:', user);
  // });

  // channel.leaving((user: any) => {
  //   this.usersInRoom--;
  //   console.log('Usuario abandonando:', user);
  // });
  // }

  createComment() {
    if (this.textMessage != '') {
      this.chatFacadeService.createMessage(this.textMessage);
      this.textMessage = '';
    }
  }

  // addTemporalCopy(message: string, tempId: string) {
  //   let chat: Message = {
  //     id: Date.now(),
  //     tempId: tempId,
  //     message: message,
  //     sender_id: this.auth.userDataValue()!.id,
  //     receiver_id: -1,
  //     status: 'sent',
  //     read_at: '',
  //     created_at: new Date().toString(),
  //     updated_at: new Date().toString()
  //   }
  //   this.updateListMessage(chat);
  // }

  // updateListMessage(newMessage: Message, searchAndReplaceWithTempId = false) {
  //   if (!searchAndReplaceWithTempId) {
  //     this.messages.update(msgs => [newMessage, ...msgs]);
  //     let chatElement = document.getElementsByClassName('chat');
  //     chatElement[0].scrollTop = chatElement[0].scrollHeight;
  //   } else {
  //     this.messages.update((msgs: any[]) => {
  //       return msgs.map(msg => {
  //         if (msg.tempId == newMessage.tempId) {
  //           return newMessage;
  //         } else {
  //           return msg;
  //         }
  //       });
  //     });
  //     debugger;
  //     let chatElement = document.getElementsByClassName('chat');
  //     chatElement[0].scrollTop = chatElement[0].scrollHeight;
  //   }
  // }

  addEmoji(event: any) {
    this.textMessage += event.detail.unicode;
  }

  hideAllEmoyiPickers() {
    this.showEmoyiPicker.set(false);
  }

  showHideEmoyi() {
    this.showEmoyiPicker.set(!this.showEmoyiPicker());
  }
}
