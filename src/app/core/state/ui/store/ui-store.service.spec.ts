import { TestBed } from '@angular/core/testing';

import { UiStoreService } from './ui-store.service';

describe('UiStoreService', () => {
  let service: UiStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
