import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkControllerComponent } from './network-controller.component';

describe('NetworkControllerComponent', () => {
  let component: NetworkControllerComponent;
  let fixture: ComponentFixture<NetworkControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
