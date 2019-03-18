import { TestBed } from '@angular/core/testing';

import { FormatService } from './format.service';

describe('FormatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormatService = TestBed.get(FormatService);
    expect(service).toBeTruthy();
  });
});
