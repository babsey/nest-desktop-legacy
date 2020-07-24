import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSidenavContentComponent } from './project-sidenav-content.component';

describe('ProjectSidenavContentComponent', () => {
  let component: ProjectSidenavContentComponent;
  let fixture: ComponentFixture<ProjectSidenavContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSidenavContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSidenavContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
