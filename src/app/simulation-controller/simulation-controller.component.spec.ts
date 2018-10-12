import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationControllerComponent } from './simulation-controller.component';

describe('SimulationControllerComponent', () => {
  let component: SimulationControllerComponent;
  let fixture: ComponentFixture<SimulationControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
