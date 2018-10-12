import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpikeChartComponent } from './spike-chart.component';

describe('SpikeChartComponent', () => {
  let component: SpikeChartComponent;
  let fixture: ComponentFixture<SpikeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpikeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpikeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
