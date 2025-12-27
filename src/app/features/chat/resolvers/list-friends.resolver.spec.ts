import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { listFriendsResolver } from './list-friends.resolver';

describe('listFriendsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => listFriendsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
