import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartControllerComponent } from './chart-controller.component';

describe('ChartControllerComponent', () => {
  let component: ChartControllerComponent;
  let fixture: ComponentFixture<ChartControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
