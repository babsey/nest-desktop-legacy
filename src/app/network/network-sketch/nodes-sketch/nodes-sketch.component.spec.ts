import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesSketchComponent } from './nodes-sketch.component';

describe('NodesSketchComponent', () => {
  let component: NodesSketchComponent;
  let fixture: ComponentFixture<NodesSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
