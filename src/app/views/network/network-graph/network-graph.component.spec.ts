import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkGraphComponent } from './network-graph.component';

describe('NetworkGraphComponent', () => {
  let component: NetworkGraphComponent;
  let fixture: ComponentFixture<NetworkGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
