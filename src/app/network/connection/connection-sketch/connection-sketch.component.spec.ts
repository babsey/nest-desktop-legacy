import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionSketchComponent } from './connection-sketch.component';

describe('ConnectionSketchComponent', () => {
  let component: ConnectionSketchComponent;
  let fixture: ComponentFixture<ConnectionSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
