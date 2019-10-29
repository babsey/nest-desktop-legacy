import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationAnalogComponent } from './animation-analog.component';

describe('AnimationAnalogComponent', () => {
  let component: AnimationAnalogComponent;
  let fixture: ComponentFixture<AnimationAnalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationAnalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationAnalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
