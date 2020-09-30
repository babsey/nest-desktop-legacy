import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityGraphConfigComponent } from './activity-graph-config.component';

describe('ActivityGraphConfigComponent', () => {
  let component: ActivityGraphConfigComponent;
  let fixture: ComponentFixture<ActivityGraphConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityGraphConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityGraphConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
