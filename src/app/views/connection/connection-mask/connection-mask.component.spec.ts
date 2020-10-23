import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionMaskComponent } from './connection-mask.component';

describe('ConnectionMaskComponent', () => {
  let component: ConnectionMaskComponent;
  let fixture: ComponentFixture<ConnectionMaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionMaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
