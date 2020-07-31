import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionSelectionComponent } from './connection-selection.component';

describe('ConnectionSelectionComponent', () => {
  let component: ConnectionSelectionComponent;
  let fixture: ComponentFixture<ConnectionSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
