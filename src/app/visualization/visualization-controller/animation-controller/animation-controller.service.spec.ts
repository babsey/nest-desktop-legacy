import { TestBed } from '@angular/core/testing';

import { AnimationControllerService } from './animation-controller.service';

describe('AnimationControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnimationControllerService = TestBed.get(AnimationControllerService);
    expect(service).toBeTruthy();
  });
});
