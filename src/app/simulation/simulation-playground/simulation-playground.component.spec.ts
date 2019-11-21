import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationPlaygroundComponent } from './simulation-playground.component';

describe('SimulationPlaygroundComponent', () => {
  let component: SimulationPlaygroundComponent;
  let fixture: ComponentFixture<SimulationPlaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationPlaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationPlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
