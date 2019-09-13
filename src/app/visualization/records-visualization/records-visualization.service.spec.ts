import { TestBed } from '@angular/core/testing';

import { RecordsVisualizationService } from './records-visualization.service';

describe('RecordsVisualizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecordsVisualizationService = TestBed.get(RecordsVisualizationService);
    expect(service).toBeTruthy();
  });
});
