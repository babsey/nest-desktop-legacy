import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDetailsComponent } from './network-details.component';

describe('NetworkDetailsComponent', () => {
  let component: NetworkDetailsComponent;
  let fixture: ComponentFixture<NetworkDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
