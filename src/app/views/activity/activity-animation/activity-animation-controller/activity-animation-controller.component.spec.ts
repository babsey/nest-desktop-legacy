import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAnimationControllerComponent } from './activity-animation-controller.component';

describe('ActivityAnimationControllerComponent', () => {
  let component: ActivityAnimationControllerComponent;
  let fixture: ComponentFixture<ActivityAnimationControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityAnimationControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityAnimationControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
