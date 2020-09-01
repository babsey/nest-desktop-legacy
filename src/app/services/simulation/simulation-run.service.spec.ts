import { TestBed, inject } from '@angular/core/testing';

import { SimulationRunService } from './simulatin-run.service';

describe('SimulationRunService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulationRunService]
    });
  });

  it('should be created', inject([SimulationRunService], (service: SimulationRunService) => {
    expect(service).toBeTruthy();
  }));
});
