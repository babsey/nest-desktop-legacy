import { TestBed, inject } from '@angular/core/testing';

import { SimulationService } from './simulation.service';

describe('SimulationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulationService]
    });
  });

  it('should be created', inject([SimulationService], (service: SimulationService) => {
    expect(service).toBeTruthy();
  }));
});
