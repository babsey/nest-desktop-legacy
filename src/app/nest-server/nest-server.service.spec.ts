import { TestBed } from '@angular/core/testing';

import { NestServerService } from './nest-server.service';

describe('NestServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NestServerService = TestBed.get(NestServerService);
    expect(service).toBeTruthy();
  });
});
