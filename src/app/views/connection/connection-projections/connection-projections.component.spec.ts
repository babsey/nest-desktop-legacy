import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionProjectionsComponent } from './connectionMenu-projections.component';

describe('ConnectionProjectionsComponent', () => {
  let component: ConnectionProjectionsComponent;
  let fixture: ComponentFixture<ConnectionProjectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionProjectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionProjectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
