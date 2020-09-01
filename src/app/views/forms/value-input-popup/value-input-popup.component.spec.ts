import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueInputPopupComponent } from './value-input-popup.component';

describe('ValueInputPopupComponent', () => {
  let component: ValueInputPopupComponent;
  let fixture: ComponentFixture<ValueInputPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueInputPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueInputPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
