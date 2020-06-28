import { TestBed } from '@angular/core/testing';

import { SimulationCodeService } from './simulation-code.service';

describe('SimulationCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimulationCodeService = TestBed.get(SimulationCodeService);
    expect(service).toBeTruthy();
  });
});
