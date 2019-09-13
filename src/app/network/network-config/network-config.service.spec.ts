import { TestBed, inject } from '@angular/core/testing';

import { NetworkConfigService } from './network-config.service';

describe('NetworkConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkConfigService]
    });
  });

  it('should be created', inject([NetworkConfigService], (service: NetworkConfigService) => {
    expect(service).toBeTruthy();
  }));
});
