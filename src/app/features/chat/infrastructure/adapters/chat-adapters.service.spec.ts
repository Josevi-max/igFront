import { TestBed } from '@angular/core/testing';

import { ChatAdaptersService } from './chat-adapters.service';

describe('ChatAdaptersService', () => {
  let service: ChatAdaptersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatAdaptersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
