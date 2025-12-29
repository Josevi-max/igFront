import { TestBed } from '@angular/core/testing';

import { CommentStoreService } from './comment-store.service';

describe('CommentStoreService', () => {
  let service: CommentStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
