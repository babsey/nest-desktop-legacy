import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputInlineComponent } from './input-inline.component';

describe('InputInlineComponent', () => {
  let component: InputInlineComponent;
  let fixture: ComponentFixture<InputInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
