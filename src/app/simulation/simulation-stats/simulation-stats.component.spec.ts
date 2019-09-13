import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationStatsComponent } from './simulation-stats.component';

describe('SimulationStatsComponent', () => {
  let component: SimulationStatsComponent;
  let fixture: ComponentFixture<SimulationStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
