import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkClearDialogComponent } from './network-clear-dialog.component';

describe('NetworkClearDialogComponent', () => {
  let component: NetworkClearDialogComponent;
  let fixture: ComponentFixture<NetworkClearDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkClearDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkClearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
