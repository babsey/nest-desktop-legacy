import { TestBed, inject } from '@angular/core/testing';

import { NetwprlSketchService } from './network-sketch.service';

describe('NetwprlSketchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetwprlSketchService]
    });
  });

  it('should be created', inject([NetwprlSketchService], (service: NetwprlSketchService) => {
    expect(service).toBeTruthy();
  }));
});
