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
  public MessageStatus = MessageStatus;

  private readonly chatFacadeService = inject(ChatFacadeService);
  private readonly chatmanagementService = inject(ChatStoreService);
  private readonly uiStoreService = inject(UiStoreService);
  private typingTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly TYPING_INACTIVITY_MS = 2000;

  public get isLoading(): Signal<boolean> {
    return this.uiStoreService.getIsLoading();
  }

  public get isTyping(): Signal<boolean> {
    return this.chatmanagementService.getIsTyping();
  }

  public get dataFriend(): Signal<ApiResponseDto<UserApiDto> | undefined> {
    return this.chatmanagementService.getDataFriend();
  }

  public get messages(): Signal<Message[]> {
    return this.chatmanagementService.getMessages();
  }

  public get showTypingGif(): Signal<boolean> {
    return this.chatmanagementService.getShowTypingGif();
  }

  public get usersInRoom(): Signal<number> {
    return this.chatmanagementService.getUsersInRoom();
  }

  public get showEmoyiPicker(): Signal<boolean> {
    return this.uiStoreService.getShowEmoyiPicker();
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
    this.uiStoreService.setShowEmoyiPicker(false);
  }

  showHideEmoyi() {
    this.uiStoreService.setShowEmoyiPicker(!this.showEmoyiPicker());
  }
}