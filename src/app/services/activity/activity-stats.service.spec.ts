import { TestBed } from '@angular/core/testing';

import { ActivityStatsService } from './activity-stats.service';

describe('ActivityStatsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityStatsService = TestBed.get(ActivityStatsService);
    expect(service).toBeTruthy();
  });
});
