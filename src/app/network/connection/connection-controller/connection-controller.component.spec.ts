import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionControllerComponent } from './connection-controller.component';

describe('ConnectionControllerComponent', () => {
  let component: ConnectionControllerComponent;
  let fixture: ComponentFixture<ConnectionControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
