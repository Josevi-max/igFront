import { TestBed } from '@angular/core/testing';

import { PublicationsAdaptersService } from './publications-adapters.service';

describe('PublicationsAdaptersService', () => {
  let service: PublicationsAdaptersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicationsAdaptersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
