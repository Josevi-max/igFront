import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import Echo from 'laravel-echo';
import { Message } from '../../models/message/messages';
import { ApiResponseDto, UserApiDto } from '../../infrastructure/models/chat-user.dto';
import { MessageStatus } from '../../domain/models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatStoreService {

  private dataFriend:WritableSignal<ApiResponseDto<UserApiDto> | undefined> = signal(undefined);
  private roomId: WritableSignal<number> = signal(-1);
  private echo: WritableSignal<Echo<'pusher'> | undefined> = signal(undefined);
  private usersInRoom: WritableSignal<number> = signal(1);
  private channel: WritableSignal<any> = signal(undefined);
  private showTypingGif: WritableSignal<boolean> = signal(false);
  private messages:WritableSignal<Message[]> = signal([]);
  private isTyping:WritableSignal<boolean>= signal(false);

  public getIsTyping(): Signal<boolean> {
    return this.isTyping;
  }

  public getMessages(): Signal<Message[]> {
    return this.messages;
  }

  public getShowTypingGif(): Signal<boolean> {
    return this.showTypingGif;
  }

  public getChannel(): Signal<any> {
    return this.channel;
  }

  public getEcho(): Signal<Echo<'pusher'> | undefined> {
    return this.echo;
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

  public setEcho(value: Echo<'pusher'>): void {
    this.echo.set(value);
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

  public setChannel(value: any): void {
    this.channel.set(value);
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
      debugger;
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
}
