import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamValueSliderComponent } from './param-value-slider.component';

describe('ParamValueSliderComponent', () => {
  let component: ParamValueSliderComponent;
  let fixture: ComponentFixture<ParamValueSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamValueSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamValueSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
