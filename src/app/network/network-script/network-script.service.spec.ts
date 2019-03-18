import { TestBed } from '@angular/core/testing';

import { NetworkScriptService } from './network-script.service';

describe('NetworkScriptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkScriptService = TestBed.get(NetworkScriptService);
    expect(service).toBeTruthy();
  });
});
