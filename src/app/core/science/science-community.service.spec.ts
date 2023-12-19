import { TestBed } from '@angular/core/testing';

import { ScienceCommunityService } from './science-community.service';

describe('ScienceIdService', () => {
  let service: ScienceCommunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScienceCommunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
