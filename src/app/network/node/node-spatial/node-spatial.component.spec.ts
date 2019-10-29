import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSpatialComponent } from './node-spatial.component';

describe('NodeSpatialComponent', () => {
  let component: NodeSpatialComponent;
  let fixture: ComponentFixture<NodeSpatialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeSpatialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSpatialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
