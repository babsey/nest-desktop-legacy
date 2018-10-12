import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationWorkspaceComponent } from './simulation-workspace.component';

describe('SimulationWorkspaceComponent', () => {
  let component: SimulationWorkspaceComponent;
  let fixture: ComponentFixture<SimulationWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationWorkspaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
