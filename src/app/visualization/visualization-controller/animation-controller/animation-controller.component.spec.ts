import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationControllerComponent } from './animation-controller.component';

describe('AnimationControllerComponent', () => {
  let component: AnimationControllerComponent;
  let fixture: ComponentFixture<AnimationControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
