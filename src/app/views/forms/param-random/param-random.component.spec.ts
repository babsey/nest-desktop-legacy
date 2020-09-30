import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamRandomComponent } from './param-random.component';

describe('ParamRandomComponent', () => {
  let component: ParamRandomComponent;
  let fixture: ComponentFixture<ParamRandomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamRandomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamRandomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
