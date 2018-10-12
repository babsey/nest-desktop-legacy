import { TestBed, inject } from '@angular/core/testing';

import { ProtocolService } from './protocol/protocol.service';

describe('ProtocolService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProtocolService]
    });
  });

  it('should be created', inject([ProtocolService], (service: ProtocolService) => {
    expect(service).toBeTruthy();
  }));
});
