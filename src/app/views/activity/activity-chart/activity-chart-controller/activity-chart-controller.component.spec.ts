import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityChartControllerComponent } from './activity-chart-controller.component';

describe('ActivityChartControllerComponent', () => {
  let component: ActivityChartControllerComponent;
  let fixture: ComponentFixture<ActivityChartControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityChartControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityChartControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
