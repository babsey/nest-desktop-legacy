import { TestBed } from '@angular/core/testing';

import { DbConfigService } from './db-config.service';

describe('DbConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbConfigService = TestBed.get(DbConfigService);
    expect(service).toBeTruthy();
  });
});
