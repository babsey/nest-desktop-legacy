import { TestBed } from '@angular/core/testing';

import { ChartRecordsService } from './chart-records.service';

describe('ChartRecordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartRecordsService = TestBed.get(ChartRecordsService);
    expect(service).toBeTruthy();
  });
});
