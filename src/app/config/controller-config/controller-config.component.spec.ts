import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerConfigComponent } from './controller-config.component';

describe('ControllerConfigComponent', () => {
  let component: ControllerConfigComponent;
  let fixture: ComponentFixture<ControllerConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
