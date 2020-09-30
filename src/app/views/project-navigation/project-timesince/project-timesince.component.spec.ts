import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTimesinceComponent } from './project-timesince.component';

describe('ProjectTimesinceComponent', () => {
  let component: ProjectTimesinceComponent;
  let fixture: ComponentFixture<ProjectTimesinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTimesinceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTimesinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
