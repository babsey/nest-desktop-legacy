import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayInputPopupComponent } from './array-input-popup.component';

describe('ArrayInputPopupComponent', () => {
  let component: ArrayInputPopupComponent;
  let fixture: ComponentFixture<ArrayInputPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrayInputPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayInputPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
