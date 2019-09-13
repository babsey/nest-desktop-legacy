import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSelectionComponent } from './network-selection.component';

describe('NetworkSelectionComponent', () => {
  let component: NetworkSelectionComponent;
  let fixture: ComponentFixture<NetworkSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
