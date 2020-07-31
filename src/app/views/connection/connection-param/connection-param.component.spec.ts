import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionParamComponent } from './connection-param.component';

describe('ConnectionParamComponent', () => {
  let component: ConnectionParamComponent;
  let fixture: ComponentFixture<ConnectionParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
