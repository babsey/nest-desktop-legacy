import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicksSliderInlineComponent } from './ticks-slider-inline.component';

describe('TicksSliderInlineComponent', () => {
  let component: TicksSliderInlineComponent;
  let fixture: ComponentFixture<TicksSliderInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicksSliderInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicksSliderInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
