import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {AnimationSceneComponent } from './animation-scene.component';

describe('ThreeScatterComponent', () => {
  let component:AnimationSceneComponent;
  let fixture: ComponentFixture<ThreeScatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnimationSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
