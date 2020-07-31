import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityStatsComponent } from './activity-stats.component';

describe('ActivityStatsComponent', () => {
  let component: ActivityStatsComponent;
  let fixture: ComponentFixture<ActivityStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
