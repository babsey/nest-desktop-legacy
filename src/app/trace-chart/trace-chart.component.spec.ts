import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceChartComponent } from './trace-chart.component';

describe('TraceChartComponent', () => {
  let component: TraceChartComponent;
  let fixture: ComponentFixture<TraceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
