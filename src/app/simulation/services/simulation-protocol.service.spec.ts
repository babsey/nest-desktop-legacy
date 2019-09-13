import { TestBed, inject } from '@angular/core/testing';

import { SimulationProtocolService } from './simulation-protocol.service';

describe('SimulationProtocolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulationProtocolService]
    });
  });

  it('should be created', inject([SimulationProtocolService], (service: SimulationProtocolService) => {
    expect(service).toBeTruthy();
  }));
});
