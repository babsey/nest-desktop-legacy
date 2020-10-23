import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSliderPopupComponent } from './value-slider-popup.component';

describe('ValueSliderPopupComponent', () => {
  let component: ValueSliderPopupComponent;
  let fixture: ComponentFixture<ValueSliderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSliderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSliderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
