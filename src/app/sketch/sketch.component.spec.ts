import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchComponent } from './sketch.component';

describe('SketchComponent', () => {
  let component: SketchComponent;
  let fixture: ComponentFixture<SketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
