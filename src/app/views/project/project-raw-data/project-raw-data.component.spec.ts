import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRawDataComponent } from './project-raw-data.component';

describe('ProjectRawDataComponent', () => {
  let component: ProjectRawDataComponent;
  let fixture: ComponentFixture<ProjectRawDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRawDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
