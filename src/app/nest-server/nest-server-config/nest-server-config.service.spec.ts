import { TestBed } from '@angular/core/testing';

import { NestServerConfigService } from './nest-server-config.service';

describe('NestServerConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NestServerConfigService = TestBed.get(NestServerConfigService);
    expect(service).toBeTruthy();
  });
});
