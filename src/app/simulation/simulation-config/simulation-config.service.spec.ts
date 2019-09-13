import { TestBed, inject } from '@angular/core/testing';

import { SimulationConfigService } from './simulation-config.service';

describe('SimulationConfigService', () => {
  beforeEach(() => {
    TestBed.NestConfigureTestingModule({
      providers: [SimulationConfigService]
    });
  });

  it('should be created', inject([SimulationConfigService], (service: SimulationConfigService) => {
    expect(service).toBeTruthy();
  }));
});
