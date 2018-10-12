import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayInputComponent } from './array-input.component';

describe('ArrayInputComponent', () => {
  let component: ArrayInputComponent;
  let fixture: ComponentFixture<ArrayInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrayInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
