import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeGraphShapeComponent } from './node-graph-shape.component';

describe('NodeGraphShapeComponent', () => {
  let component: NodeGraphShapeComponent;
  let fixture: ComponentFixture<NodeGraphShapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeGraphShapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeGraphShapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
