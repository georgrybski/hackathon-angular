import { TestBed } from '@angular/core/testing';

import { UserRetrievalService } from './user-retrieval.service';

describe('UserRetrievalService', () => {
  let service: UserRetrievalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRetrievalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
