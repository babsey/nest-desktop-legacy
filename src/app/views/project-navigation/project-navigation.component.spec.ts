import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNavigationComponent } from './project-navigation.component';

describe('ProjectNavigationComponent', () => {
  let component: ProjectNavigationComponent;
  let fixture: ComponentFixture<ProjectNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
