import { TestBed } from '@angular/core/testing';

import { UserimportService } from './userimport.service';

describe('UserimportService', () => {
  let service: UserimportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserimportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
