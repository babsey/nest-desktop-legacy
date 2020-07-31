import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityChartComponent } from './activity-chart.component';

describe('ActivityChartComponent', () => {
  let component: ActivityChartComponent;
  let fixture: ComponentFixture<ActivityChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
