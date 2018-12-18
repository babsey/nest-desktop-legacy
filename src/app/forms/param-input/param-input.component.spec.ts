import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamInputComponent } from './param-input.component';

describe('ParamInputComponent', () => {
  let component: ParamInputComponent;
  let fixture: ComponentFixture<ParamInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
