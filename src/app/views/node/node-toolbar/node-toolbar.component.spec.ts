import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeToolbarComponent } from './node-toolbar.component';

describe('NodeToolbarComponent', () => {
  let component: NodeToolbarComponent;
  let fixture: ComponentFixture<NodeToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
