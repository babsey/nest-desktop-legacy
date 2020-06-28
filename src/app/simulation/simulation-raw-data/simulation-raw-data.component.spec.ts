import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationRawDataComponent } from './simulation-raw-data.component';

describe('SimulationRawDataComponent', () => {
  let component: SimulationRawDataComponent;
  let fixture: ComponentFixture<SimulationRawDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationRawDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationRawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
