import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkListComponent } from './network-list.component';

describe('NetworkListComponent', () => {
  let component: NetworkListComponent;
  let fixture: ComponentFixture<NetworkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
