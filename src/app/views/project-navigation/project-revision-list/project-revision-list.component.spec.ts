import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRevisionListComponent } from './project-resivion-list.component';

describe('ProjectRevisionListComponent', () => {
  let component: ProjectRevisionListComponent;
  let fixture: ComponentFixture<ProjectRevisionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRevisionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRevisionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
