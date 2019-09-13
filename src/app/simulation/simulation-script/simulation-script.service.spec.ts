import { TestBed } from '@angular/core/testing';

import { SimulationScriptService } from './simulation-script.service';

describe('SimulationScriptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimulationScriptService = TestBed.get(SimulationScriptService);
    expect(service).toBeTruthy();
  });
});
