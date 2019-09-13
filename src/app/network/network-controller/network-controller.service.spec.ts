import { TestBed } from '@angular/core/testing';

import { NetworkControllerService } from './network-controller.service';

describe('NetworkControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkControllerService = TestBed.get(NetworkControllerService);
    expect(service).toBeTruthy();
  });
});
