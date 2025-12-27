import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ChatFacadeService } from '../state/facade/chat-facade.service';

export const listFriendsResolver: ResolveFn<void> = (route, state) => {
  const chatFacadeService = inject(ChatFacadeService);
  chatFacadeService.getDataUserChatted();
};
