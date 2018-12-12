import { TestBed, inject } from '@angular/core/testing';

import { ControllerService } from './controller.service';

describe('ControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControllerService]
    });
  });

  it('should be created', inject([ControllerService], (service: ControllerService) => {
    expect(service).toBeTruthy();
  }));
});
