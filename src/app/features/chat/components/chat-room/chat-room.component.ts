import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal, Signal, effect, OnDestroy } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListFriendsComponent } from '../list-friends/list-friends.component';
import { FormsModule } from '@angular/forms';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import { takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { ChatService } from '../../services/chat/chat.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { Message } from '../../models/message/messages';
import { config } from '../../../../config/config';
import { User } from '../../../../core/models/user/user';
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

  onDestroy = signal<any>(false);
  textMessage: string = '';
  idFriend: number = -1;
  loading = true;
  messages = signal<Message[]>([]);
  isTyping = signal<boolean>(false);
  dataFriend = signal<User | undefined>(undefined);
  echo: any;
  roomId: number = -1;
  usersInRoom: number = 1;
  showTypingGif = false;
  constructor(private route: ActivatedRoute, public auth: AuthService, private _chatService: ChatService) {
    this.route.params.subscribe(
      params => {
        this.loading = true;
        const id = params['id'];
        this.idFriend = id;
        this.getMessagesChat();
        this._chatService.getInfoUserChat(this.idFriend).subscribe(
          (response) => {
            this.dataFriend.set(response.data);
            this.loading = false
          },
          takeUntil(this.onDestroy())
        )
        this._chatService.getOrCreateRoom(this.idFriend).subscribe(
          (response) => {
            this.roomId = response.data['roomId'];
            this.joinRoom();
          },
          takeUntil(this.onDestroy())
        )
      },
      takeUntil(this.onDestroy())
    );
    effect(() => {
      if (this.isTyping()) {
        setTimeout(() => {
          if (this.isTyping()) {
            this.isTyping.set(false);
            this._chatService
              .sendTypingEvent(this.roomId, this.isTyping(), this.auth.userData().id)
              .subscribe({
                next: () => console.log('Evento de detención de escritura enviado'),
                error: (err) => console.error('Error al enviar el evento:', err)
              });
          }
        }, 2000);
      }
    });
  }

  onInput() {
    if (!this.isTyping()) {
      this.isTyping.set(true);
      this._chatService.sendTypingEvent(this.roomId, this.isTyping(), this.auth.userData().id).subscribe();
    }
  }


  joinRoom() {
    console.log(this.messages());
    Pusher.logToConsole = true;
    let channelName = `chat.${this.roomId}`;
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: config.pusher.key,
      cluster: config.pusher.cluster,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
      authEndpoint: config.api.URL_BACKEND_BASE + '/broadcasting/auth',
    });

    const channel = this.echo.join(channelName);

    channel.listen('.new-chat-message', (data: any) => {
      if (this.usersInRoom > 1) {
        data['chat'].status = 'read';
      } else {
        data['chat'].status = 'delivered';
      }
      if (data['chat'].sender_id === this.auth.userData().id) {
        this.updateListMessage(data['chat'], true);
      } else {
        this.updateListMessage(data['chat']);
      }

      this._chatService.changeStatusMessage(data['chat'].status, data['chat'].id).subscribe(
        (data: any) => {
          console.log(data);
        }, (error) => {
          console.log(error);
        }
      )
    });
    channel.listen('.user-typing', (data: any) => {
      debugger;
      if (data.idUserTyping != this.auth.userData().id) {
        this.showTypingGif = data.isTyping;
      }
    });
    channel.here((users: any[]) => {
      this.usersInRoom = users.length;
      if (this.usersInRoom > 1) {
        this._chatService.changeStatusMessage('read').subscribe(
          (data: any) => {
            console.log(data);
          }, (error) => {
            console.log(error);
          }
        )
      }
      console.log('Usuarios conectados:', users);
    });

    channel.joining((user: any) => {
      this.usersInRoom++;
      this._chatService.changeStatusMessage('read').subscribe(
        (data: any) => {
          console.log(data);
        }, (error) => {
          console.log(error);
        }
      )
      console.log('Usuario uniéndose:', user);
    });

    channel.leaving((user: any) => {
      this.usersInRoom--;
      console.log('Usuario abandonando:', user);
    });
  }

  createComment() {
    if (this.textMessage != '') {
      var tempId: string = Math.random().toString(36).substr(2, 9);
      this.addTemporalCopy(this.textMessage, tempId);
      let valueMessage =  this.textMessage;
      this.textMessage = '';
      this._chatService.sendMessage(valueMessage, this.idFriend, tempId).subscribe(
        (data: any) => {
          console.log(data);
        }, (error) => {
          console.log(error);
        }
      )
    }
  }

  addTemporalCopy(message: string, tempId: string) {
    let chat: Message = {
      id: Date.now(),
      tempId: tempId,
      message: message,
      sender_id: this.auth.userData().id,
      receiver_id: -1,
      status: 'sent',
      read_at: '',
      created_at: new Date().toString(),
      updated_at: new Date().toString()
    }
    this.updateListMessage(chat);
  }

  getMessagesChat() {
    return this._chatService.getMessagesChat(this.idFriend).subscribe(
      (data: any) => {
        this.messages.set(data.response);
      }, (error) => {
        console.log(error);
      }
    )
  }

  updateListMessage(newMessage: Message, searchAndReplaceWithTempId = false) {
    if (!searchAndReplaceWithTempId) {
      this.messages.update(msgs => [newMessage, ...msgs]);
      let chatElement = document.getElementsByClassName('chat');
      chatElement[0].scrollTop = chatElement[0].scrollHeight;
    } else {
      this.messages.update((msgs: any[]) => {
        return msgs.map(msg => {
          if (msg.tempId == newMessage.tempId) {
            return newMessage;
          } else {
            return msg;
          }
        });
      });
      debugger;
      let chatElement = document.getElementsByClassName('chat');
      chatElement[0].scrollTop = chatElement[0].scrollHeight;
    }
  }

  addEmoji(event: any) {
    this.textMessage += event.detail.unicode;
  }

  hideAllEmoyiPickers(event: Event) {
    if ((event.target as HTMLElement).closest('#emoyiPicker, input, .emoyiInputIcon')) {
      return;
    }
    let emoyiPicker = document.getElementById('emoyiPicker') as HTMLElement;
    emoyiPicker.classList.add('d-none');
  }

  showHideEmoyi() {
    let emoyiPicker = document.getElementById('emoyiPicker') as HTMLElement;
    if (emoyiPicker.classList.contains('d-none')) {
      emoyiPicker.classList.remove('d-none')
    } else {
      emoyiPicker.classList.add('d-none')
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.set(true);
    if (this.echo) {
      this.echo.leaveChannel(`chat.${this.roomId}`);
    }
  }
}
