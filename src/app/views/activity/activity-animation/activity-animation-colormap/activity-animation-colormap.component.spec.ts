import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationColormapComponent } from './animation-colormap.component';

describe('AnimationColormapComponent', () => {
  let component: AnimationColormapComponent;
  let fixture: ComponentFixture<AnimationColormapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationColormapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationColormapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
