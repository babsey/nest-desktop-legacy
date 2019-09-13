import { TestBed } from '@angular/core/testing';

import { VisualizationService } from './visualization.service';

describe('VisualizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisualizationService = TestBed.get(VisualizationService);
    expect(service).toBeTruthy();
  });
});
