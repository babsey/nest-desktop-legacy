import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationCheckComponent } from './validation-check.component';

describe('ValidationCheckComponent', () => {
  let component: ValidationCheckComponent;
  let fixture: ComponentFixture<ValidationCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
