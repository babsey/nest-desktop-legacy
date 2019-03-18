import { TestBed, inject } from '@angular/core/testing';

import { NetworkProtocolService } from './network-protocol.service';

describe('NetworkProtocolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkProtocolService]
    });
  });

  it('should be created', inject([NetworkProtocolService], (service: NetworkProtocolService) => {
    expect(service).toBeTruthy();
  }));
});
