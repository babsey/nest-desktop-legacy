import { TestBed } from '@angular/core/testing';

import { ActivityChartPanelService } from './activity-chart-panel.service';

describe('ActivityChartPanelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityChartPanelService = TestBed.get(ActivityChartPanelService);
    expect(service).toBeTruthy();
  });
});
