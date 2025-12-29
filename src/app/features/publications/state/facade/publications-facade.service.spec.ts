import { TestBed } from '@angular/core/testing';

import { PublicationsFacadeService } from './publications-facade.service';

describe('PublicationsFacadeService', () => {
  let service: PublicationsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
