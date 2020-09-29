import { TestBed, inject } from '@angular/core/testing';

import { NetworkGraphService } from './network-graph.service';

describe('NetworkGraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkGraphService]
    });
  });

  it('should be created', inject([NetworkGraphService], (service: NetworkGraphService) => {
    expect(service).toBeTruthy();
  }));
});
