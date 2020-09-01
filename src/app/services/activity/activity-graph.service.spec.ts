import { TestBed } from '@angular/core/testing';

import { ActivityGraphService } from './activity-graph.service';

describe('ActivityGraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityGraphService = TestBed.get(ActivityGraphService);
    expect(service).toBeTruthy();
  });
});
