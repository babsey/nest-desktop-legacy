import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundSketchComponent } from './background-sketch.component';

describe('BackgroundSketchComponent', () => {
  let component: BackgroundSketchComponent;
  let fixture: ComponentFixture<BackgroundSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
