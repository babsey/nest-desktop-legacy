import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicksSliderComponent } from './ticks-slider.component';

describe('TicksSliderComponent', () => {
  let component: TicksSliderComponent;
  let fixture: ComponentFixture<TicksSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicksSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicksSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
