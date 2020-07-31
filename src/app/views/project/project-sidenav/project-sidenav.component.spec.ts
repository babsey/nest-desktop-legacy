import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSidenavComponent } from './project-sidenav.component';

describe('ProjectSidenavComponent', () => {
  let component: ProjectSidenavComponent;
  let fixture: ComponentFixture<ProjectSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
