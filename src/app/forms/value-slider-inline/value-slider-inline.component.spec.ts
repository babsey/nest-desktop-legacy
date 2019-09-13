import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueSliderInlineComponent } from './value-slider-inline.component';

describe('ValueSliderInlineComponent', () => {
  let component: ValueSliderInlineComponent;
  let fixture: ComponentFixture<ValueSliderInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueSliderInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueSliderInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
