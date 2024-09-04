import { TestBed } from '@angular/core/testing';

import { GrouplistService } from './grouplist.service';

describe('GrouplistService', () => {
  let service: GrouplistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrouplistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
