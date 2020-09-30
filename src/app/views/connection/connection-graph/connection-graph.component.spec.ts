import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionGraphComponent } from './connection-graph.component';

describe('ConnectionGraphComponent', () => {
  let component: ConnectionGraphComponent;
  let fixture: ComponentFixture<ConnectionGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
