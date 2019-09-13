import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamConfigComponent } from './param-config.component';

describe('ParamConfigComponent', () => {
  let component: ParamConfigComponent;
  let fixture: ComponentFixture<ParamConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
