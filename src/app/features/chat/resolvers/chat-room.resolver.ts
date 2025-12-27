import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ChatFacadeService } from '../state/facade/chat-facade.service';

export const chatRoomResolver: ResolveFn<void> = (route, state) => {
  const idUser = Number(route.paramMap.get('id'));
  const chatFacadeService = inject(ChatFacadeService);
  chatFacadeService.loadInfoUserChat(idUser);
  chatFacadeService.getListMessages(idUser);
  chatFacadeService.loadRoomOrCreateIfNotExists(idUser);
  chatFacadeService.getDataUserChatted();
};
