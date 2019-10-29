import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotControllerComponent } from './plot-controller.component';

describe('PlotControllerComponent', () => {
  let component: PlotControllerComponent;
  let fixture: ComponentFixture<PlotControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
