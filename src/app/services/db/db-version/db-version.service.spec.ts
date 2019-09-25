import { TestBed } from '@angular/core/testing';

import { DbVersionService } from './db-version.service';

describe('DbVersionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbVersionService = TestBed.get(DbVersionService);
    expect(service).toBeTruthy();
  });
});
