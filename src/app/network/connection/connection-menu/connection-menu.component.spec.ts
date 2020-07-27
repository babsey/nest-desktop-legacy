import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionMenuComponent } from './connection-menu.component';

describe('ConnectionMenuComponent', () => {
  let component: ConnectionMenuComponent;
  let fixture: ComponentFixture<ConnectionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
