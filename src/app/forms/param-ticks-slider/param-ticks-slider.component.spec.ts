import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamTicksSliderComponent } from './param-ticks-slider.component';

describe('ParamTicksSliderComponent', () => {
  let component: ParamTicksSliderComponent;
  let fixture: ComponentFixture<ParamTicksSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamTicksSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamTicksSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
