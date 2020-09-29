import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkGraphBgComponent } from './network-graph-bg.component';

describe('NetworkGraphBgComponent', () => {
  let component: NetworkGraphBgComponent;
  let fixture: ComponentFixture<NetworkGraphBgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkGraphBgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkGraphBgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
