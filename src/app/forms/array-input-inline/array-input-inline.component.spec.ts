import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayInputInlineComponent } from './array-input-inline.component';

describe('ArrayInputInlineComponent', () => {
  let component: ArrayInputInlineComponent;
  let fixture: ComponentFixture<ArrayInputInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrayInputInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayInputInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
