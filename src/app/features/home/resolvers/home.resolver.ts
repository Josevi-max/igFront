import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PublicationsFacadeService } from '../../publications/state/facade/publications-facade.service';

export const homeResolver: ResolveFn<void> = (route, state) => {
  const publicationsFacadeService = inject(PublicationsFacadeService);
  const START_PAGE = 1;
  publicationsFacadeService.getListPublications(START_PAGE);
};
