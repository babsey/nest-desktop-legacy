import { TestBed } from '@angular/core/testing';

import { ActivityAnimationService } from './activity-animation.service';

describe('ActivityAnimationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityAnimationService = TestBed.get(ActivityAnimationService);
    expect(service).toBeTruthy();
  });
});
