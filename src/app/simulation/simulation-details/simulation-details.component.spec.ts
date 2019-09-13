import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationDetailsComponent } from './simulation-details.component';

describe('SimulationDetailsComponent', () => {
  let component: SimulationDetailsComponent;
  let fixture: ComponentFixture<SimulationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
