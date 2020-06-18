import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkNavbarComponent } from './network-navbar.component';

describe('NetworkNavbarComponent', () => {
  let component: NetworkNavbarComponent;
  let fixture: ComponentFixture<NetworkNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
