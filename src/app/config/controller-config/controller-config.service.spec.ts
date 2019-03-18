import { TestBed, inject } from '@angular/core/testing';

import { ControllerConfigService } from './controller-config.service';

describe('ControllerConfigService', () => {
  beforeEach(() => {
    TestBed.NestConfigureTestingModule({
      providers: [ControllerConfigService]
    });
  });

  it('should be created', inject([ControllerConfigService], (service: ControllerConfigService) => {
    expect(service).toBeTruthy();
  }));
});
