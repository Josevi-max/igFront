import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { config } from '../../../../config/config';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  http = inject(HttpClient);
  _authService = inject(AuthService);
  dataActualUser = signal({});


  sendTypingEvent(roomId:number,isUserTyping:boolean,idUserTyping:number):Observable<any>{
    return this.http.post(config.api.URL_BACKEND + '/chat/user-typing', {
      'roomId': roomId,
      'isUserTyping': isUserTyping,
      'idUserTyping': idUserTyping
    });
  }

  getDataUserChatted():Observable<any>{
    return this.http.get(config.api.URL_BACKEND + '/chat/get-list-user-with-chats/' + this._authService.userData().id);
  }

  getInfoUserChat(idUser:number):Observable<any>{
    return this.http.get(config.api.URL_BACKEND + '/chat/get-info-user/' + idUser);
  }

  sendMessage(myMessage: string, receiverId: number, tempId:string): Observable<any> {
    return this.http.post(config.api.URL_BACKEND + '/chat/send-message', {
      'message': myMessage,
      'sender_id': this._authService.userData().id,
      'receiver_id': receiverId,
      'tempId' : tempId
    });
  }

  changeStatusMessage(newStatus:string,idMessage:number = -1){
    return this.http.post(config.api.URL_BACKEND + '/chat/chage-status-message', {
      'status': newStatus,
      'idMessage': idMessage
    });
  }

  getMessagesChat(userId2: number): Observable<any> {
    return this.http.get(config.api.URL_BACKEND + '/chat/get-chat-messages/' + userId2);
  }

  getOrCreateRoom(idFriend: number): Observable<any> {
    return this.http.post(config.api.URL_BACKEND + '/chat/create-room/', {
      'sender_id': this._authService.userData().id,
      'receiver_id': idFriend
    });
  }

}
