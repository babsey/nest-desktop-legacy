import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeParamComponent } from './node-param.component';

describe('NodeParamComponent', () => {
  let component: NodeParamComponent;
  let fixture: ComponentFixture<NodeParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
