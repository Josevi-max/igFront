import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ApiResponseDto, Message, UserApiDto } from '../../infrastructure/models/chat-user.dto';
import { MessageStatus } from '../../domain/models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatStoreService {

  private dataFriend:WritableSignal<ApiResponseDto<UserApiDto> | undefined> = signal(undefined);
  private roomId: WritableSignal<number> = signal(-1);
  private usersInRoom: WritableSignal<number> = signal(1);
  private showTypingGif: WritableSignal<boolean> = signal(false);
  private messages:WritableSignal<Message[]> = signal([]);
  private isTyping:WritableSignal<boolean>= signal(false);
  private listUserChatted: WritableSignal<UserApiDto[] | undefined> = signal(undefined);

  public getListUserChatted(): Signal<UserApiDto[] | undefined> {
    return this.listUserChatted;
  }

  public getIsTyping(): Signal<boolean> {
    return this.isTyping;
  }

  public getMessages(): Signal<Message[]> {
    return this.messages;
  }

  public getShowTypingGif(): Signal<boolean> {
    return this.showTypingGif;
  }

  public getUsersInRoom(): Signal<number> {
    return this.usersInRoom;
  }

  public getDataFriend(): Signal<ApiResponseDto<UserApiDto> | undefined> {
    return this.dataFriend;
  }

  public getRoomId(): WritableSignal<number> {
    return this.roomId;
  }
  
  public setDataFriend(value: ApiResponseDto<UserApiDto> | undefined): void {
    this.dataFriend.set(value);
  }

  public setRoomId(value: number): void {
    this.roomId.set(value);
  }

  public setUsersInRoom(value: number): void {
    this.usersInRoom.set(value);
  }

  public incrementUsersInRoom(): void {
    this.usersInRoom.set(this.usersInRoom() + 1);
  }

  public decrementUsersInRoom(): void {
    this.usersInRoom.set(this.usersInRoom() - 1);
  }

  public setShowTypingGif(value: boolean): void {
    this.showTypingGif.set(value);
  }

  public setMessages(value: Message[]): void {
    this.messages.set(value);
  }

  public addMessage(value: Message): void {
    this.messages.set([value,...this.messages()]);
  }

  public updateStatusMessage(newMessage: Message, status: MessageStatus): void {
    const updatedMessages = this.messages().map(message => {
      if (message.tempId === newMessage.tempId) {
        return { ...message, id: newMessage.id, status: status };
      }
      return message;
    });
    this.messages.set(updatedMessages);
  }

  public setIsTyping(value: boolean): void {
    this.isTyping.set(value);
  }

  public setListUserChatted(value: UserApiDto[] | undefined): void {
    this.listUserChatted.set(value);
  }
}
