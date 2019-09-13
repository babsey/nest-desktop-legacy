import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamSliderPopupComponent } from './param-slider-popup.component';

describe('ParamSliderPopupComponent', () => {
  let component: ParamSliderPopupComponent;
  let fixture: ComponentFixture<ParamSliderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamSliderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamSliderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
