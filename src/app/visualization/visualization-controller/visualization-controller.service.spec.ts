import { TestBed } from '@angular/core/testing';

import { VisualizationControllerService } from './visualization-controller.service';

describe('VisualizationControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisualizationControllerService = TestBed.get(VisualizationControllerService);
    expect(service).toBeTruthy();
  });
});
