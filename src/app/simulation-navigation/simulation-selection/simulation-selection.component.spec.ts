import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationSelectionComponent } from './simulation-selection.component';

describe('SimulationSelectionComponent', () => {
  let component: SimulationSelectionComponent;
  let fixture: ComponentFixture<SimulationSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
