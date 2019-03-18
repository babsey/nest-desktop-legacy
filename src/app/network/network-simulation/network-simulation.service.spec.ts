import { TestBed, inject } from '@angular/core/testing';

import { NetworkSimulationService } from './network-simulation.service';

describe('NetworkSimulationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkSimulationService]
    });
  });

  it('should be created', inject([NetworkSimulationService], (service: NetworkSimulationService) => {
    expect(service).toBeTruthy();
  }));
});
