import { TestBed } from '@angular/core/testing';

import { ActivityChartService } from './activity-chart.service';

describe('ActivityChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityChartService = TestBed.get(ActivityChartService);
    expect(service).toBeTruthy();
  });
});
