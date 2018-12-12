import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSketchComponent } from './node-sketch.component';

describe('NodeSketchComponent', () => {
  let component: NodeSketchComponent;
  let fixture: ComponentFixture<NodeSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
