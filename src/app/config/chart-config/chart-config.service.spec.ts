import { TestBed } from '@angular/core/testing';

import { ChartConfigService } from './chart-config.service';

describe('ChartConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartConfigService = TestBed.get(ChartConfigService);
    expect(service).toBeTruthy();
  });
});
