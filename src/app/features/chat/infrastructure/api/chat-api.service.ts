import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthManagementService } from '../../../../core/state/auth/store/auth-management.service';
import { Observable } from 'rxjs';
import { config } from '../../../../config/config';
import { ChatAdaptersService } from '../adapters/chat-adapters.service';
import { ApiResponseDto, UserApiDto } from '../models/chat-user.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {

  private readonly http = inject(HttpClient);
  private readonly chatAdaptersService = inject(ChatAdaptersService);
  private readonly _authManagementService = inject(AuthManagementService);


  public sendTypingEvent(roomId: number, isUserTyping: boolean, idUserTyping: number): Observable<any> {
    const searchParamsTypingEvent = this.chatAdaptersService.sendTypingEventAdapter(roomId, isUserTyping, idUserTyping);
    return this.http.post(config.api.URL_BACKEND + '/chat/user-typing', searchParamsTypingEvent);
  }

  public getDataUserChatted(): Observable<any> {
    return this.http.get(config.api.URL_BACKEND + '/chat/get-list-user-with-chats/' + this._authManagementService.userDataValue()?.id);
  }

  public getInfoUserChat(idUser: number): Observable<ApiResponseDto<UserApiDto>> {
    return this.http.get<ApiResponseDto<UserApiDto>>(config.api.URL_BACKEND + '/chat/get-info-user/' + idUser);
  }

  public sendMessage(myMessage: string, receiverId: number, tempId: string): Observable<any> {
    const searchParamsSendMessage = this.chatAdaptersService.sendMessageAdapter(myMessage, receiverId, this._authManagementService.userDataValue()?.id!, tempId);
    return this.http.post(config.api.URL_BACKEND + '/chat/send-message', searchParamsSendMessage);
  }

  public changeStatusMessage(newStatus: string, idMessage: number = -1) {
    const searchParamsChangeStatus = this.chatAdaptersService.changeStatusMessageAdapter(newStatus, idMessage);
    return this.http.post(config.api.URL_BACKEND + '/chat/chage-status-message', searchParamsChangeStatus);
  }

  public getMessagesChat(userId2: number): Observable<any> {
    return this.http.get(config.api.URL_BACKEND + '/chat/get-chat-messages/' + userId2);
  }

  public getOrCreateRoom(idFriend: number): Observable<any> {
    const searchParamsGetOrCreateRoom = this.chatAdaptersService.getOrCreateRoomAdapter(idFriend, this._authManagementService.userDataValue()?.id!);
    return this.http.post(config.api.URL_BACKEND + '/chat/create-room/', searchParamsGetOrCreateRoom);
  }
}
