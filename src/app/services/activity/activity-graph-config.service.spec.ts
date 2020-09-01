import { TestBed } from '@angular/core/testing';

import { ActivityGraphConfigService } from './activity-graph-config.service';

describe('ActivityGraphConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityGraphConfigService = TestBed.get(ActivityGraphConfigService);
    expect(service).toBeTruthy();
  });
});
