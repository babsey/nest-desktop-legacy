import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSelectionComponent } from './project-selection.component';

describe('ProjectSelectionComponent', () => {
  let component: ProjectSelectionComponent;
  let fixture: ComponentFixture<ProjectSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
