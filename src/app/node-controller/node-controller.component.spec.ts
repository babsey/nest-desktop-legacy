import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeControllerComponent } from './node-controller.component';

describe('NodeControllerComponent', () => {
  let component: NodeControllerComponent;
  let fixture: ComponentFixture<NodeControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
