import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueInputInlineComponent } from './value-input-inline.component';

describe('ValueInputInlineComponent', () => {
  let component: ValueInputInlineComponent;
  let fixture: ComponentFixture<ValueInputInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueInputInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueInputInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
