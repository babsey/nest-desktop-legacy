import { TestBed } from '@angular/core/testing';

import { PlotRecordsService } from './plot-records.service';

describe('PlotRecordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlotRecordsService = TestBed.get(PlotRecordsService);
    expect(service).toBeTruthy();
  });
});
