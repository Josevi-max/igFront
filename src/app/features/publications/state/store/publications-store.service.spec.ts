import { TestBed } from '@angular/core/testing';

import { PublicationsStoreService } from './publications-store.service';

describe('PublicationsStoreService', () => {
  let service: PublicationsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
