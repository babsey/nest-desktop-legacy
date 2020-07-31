import { TestBed } from '@angular/core/testing';

import { ModelConfigService } from './model-config.service';

describe('ModelConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelConfigService = TestBed.get(ModelConfigService);
    expect(service).toBeTruthy();
  });
});
