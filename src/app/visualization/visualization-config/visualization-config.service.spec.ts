import { TestBed } from '@angular/core/testing';

import { VisualizationConfigService } from './visualization-config.service';

describe('VisualizationConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisualizationConfigService = TestBed.get(VisualizationConfigService);
    expect(service).toBeTruthy();
  });
});
