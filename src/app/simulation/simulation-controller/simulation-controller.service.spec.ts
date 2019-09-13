import { TestBed, inject } from '@angular/core/testing';

import { SimulationControllerService } from './simulation-controller.service';

describe('SimulationControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulationControllerService]
    });
  });

  it('should be created', inject([SimulationControllerService], (service: SimulationControllerService) => {
    expect(service).toBeTruthy();
  }));
});
