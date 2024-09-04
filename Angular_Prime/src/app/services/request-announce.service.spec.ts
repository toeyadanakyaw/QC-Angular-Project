import { TestBed } from '@angular/core/testing';

import { RequestAnnounceService } from './request-announce.service';

describe('RequestAnnounceService', () => {
  let service: RequestAnnounceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestAnnounceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
