import { TestBed } from '@angular/core/testing';

import { CommonsAdaptersService } from './commons-adapters.service';

describe('CommonsAdaptersService', () => {
  let service: CommonsAdaptersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonsAdaptersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
