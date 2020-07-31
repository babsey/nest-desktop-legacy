import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityChartSplitControllerComponent } from './activity-chart-split-controller.component';

describe('ActivityChartSplitControllerComponent', () => {
  let component: ActivityChartSplitControllerComponent;
  let fixture: ComponentFixture<ActivityChartSplitControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityChartSplitControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityChartSplitControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
