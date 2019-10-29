import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationSpikeComponent } from './animation-spike.component';

describe('AnimationSpikeComponent', () => {
  let component: AnimationSpikeComponent;
  let fixture: ComponentFixture<AnimationSpikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationSpikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationSpikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
