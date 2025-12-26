import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatAdaptersService {

  public sendTypingEventAdapter(roomId:number,isUserTyping:boolean,idUserTyping:number):HttpParams{
    let params = new HttpParams();
    debugger;
    params = params.set('roomId', roomId);
    params = params.set('isUserTyping', isUserTyping);
    params = params.set('idUserTyping', idUserTyping);
    return params;
  }

  public sendMessageAdapter(myMessage: string, receiverId: number, senderId:number, tempId:string):HttpParams{
    let params = new HttpParams();
    params = params.set('message', myMessage);
    params = params.set('sender_id', senderId);
    params = params.set('receiver_id', receiverId);
    params = params.set('tempId', tempId);
    return params;
  }

  public changeStatusMessageAdapter(newStatus:string,idMessage:number = -1):HttpParams{
    let params = new HttpParams();
    params = params.set('status', newStatus);
    params = params.set('idMessage', idMessage);
    return params;
  }

  public getOrCreateRoomAdapter(idFriend: number, senderId:number):HttpParams{
    let params = new HttpParams();
    params = params.set('sender_id', senderId);
    params = params.set('receiver_id', idFriend);
    return params;
  }
}
