import { TestBed, inject } from '@angular/core/testing';

import { ProjectControllerService } from './project-controller.service';

describe('ProjectControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectControllerService]
    });
  });

  it('should be created', inject([ProjectControllerService], (service: ProjectControllerService) => {
    expect(service).toBeTruthy();
  }));
});
