import { TestBed } from '@angular/core/testing';

import { CommentFacadeService } from './comment-facade.service';

describe('CommentFacadeService', () => {
  let service: CommentFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
