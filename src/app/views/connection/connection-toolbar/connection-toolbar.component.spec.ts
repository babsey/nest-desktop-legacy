import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionToolbarComponent } from './connection-toolbar.component';

describe('ConnectionToolbarComponent', () => {
  let component: ConnectionToolbarComponent;
  let fixture: ComponentFixture<ConnectionToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
