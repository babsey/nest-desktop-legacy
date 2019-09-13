import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicksSliderPopupComponent } from './ticks-slider-popup.component';

describe('TicksSliderPopupComponent', () => {
  let component: TicksSliderPopupComponent;
  let fixture: ComponentFixture<TicksSliderPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicksSliderPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicksSliderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
