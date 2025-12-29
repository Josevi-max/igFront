import { TestBed } from '@angular/core/testing';

import { CommentAdaptersService } from './comment-adapters.service';

describe('CommentAdaptersService', () => {
  let service: CommentAdaptersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentAdaptersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
