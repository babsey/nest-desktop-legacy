import { TestBed } from '@angular/core/testing';

import { DistributionService } from './distribution.service';

describe('DistributionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DistributionService = TestBed.get(DistributionService);
    expect(service).toBeTruthy();
  });
});
