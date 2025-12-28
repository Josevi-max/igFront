import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, Signal, OnDestroy, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFriendsComponent } from '../list-friends/list-friends.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { ChatFacadeService } from '../../state/facade/chat-facade.service';
import { ChatStoreService } from '../../state/store/chat-store.service';
import { ApiResponseDto, Message, UserApiDto } from '../../infrastructure/models/chat-user.dto';
import { MessageStatus } from '../../domain/models/chat.model';
import { EmojiClickEvent } from 'emoji-picker-element/shared';
import { UiStoreService } from '../../../../core/state/ui/store/ui-store.service';
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

  public textMessage: string = '';
  public loading: Signal<boolean> = signal(false);
  public messages: Signal<Message[]> = signal([]);
  public isTyping: Signal<boolean> = signal(false);
  public dataFriend: Signal<ApiResponseDto<UserApiDto> | undefined> = signal(undefined);
  public usersInRoom: Signal<number> = signal(1);
  public showTypingGif: Signal<boolean> = signal(false);
  public showEmoyiPicker: WritableSignal<boolean> = signal(false);
  public MessageStatus = MessageStatus;
  private readonly chatFacadeService = inject(ChatFacadeService);
  private readonly chatmanagementService = inject(ChatStoreService);
  private readonly uiStoreService = inject(UiStoreService);
  private typingTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly TYPING_INACTIVITY_MS = 2000;

  constructor() {
    this.isTyping = this.chatmanagementService.getIsTyping();
    this.dataFriend = this.chatmanagementService.getDataFriend();
    this.messages = this.chatmanagementService.getMessages();
    this.showTypingGif = this.chatmanagementService.getShowTypingGif();
    this.usersInRoom = this.chatmanagementService.getUsersInRoom();
    this.loading = this.uiStoreService.getIsLoading();
  }

  ngOnDestroy(): void {
    this.chatFacadeService.leaveRoom();
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      this.typingTimer = null;
      this.chatFacadeService.updateTypingStatus(false);
    }
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

  createComment() {
    if (this.textMessage != '') {
      this.chatFacadeService.createMessage(this.textMessage);
      this.textMessage = '';
    }
  }

  addEmoji(event: EmojiClickEvent) {
    this.textMessage += event.detail.unicode;
  }

  hideAllEmoyiPickers() {
    this.showEmoyiPicker.set(false);
  }

  showHideEmoyi() {
    this.showEmoyiPicker.set(!this.showEmoyiPicker());
  }
}