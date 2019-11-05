import { TestBed, inject } from '@angular/core/testing';

import { SimulationEventService } from './simulation-event.service';

describe('SimulationEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulationEventService]
    });
  });

  it('should be created', inject([SimulationEventService], (service: SimulationEventService) => {
    expect(service).toBeTruthy();
  }));
});
