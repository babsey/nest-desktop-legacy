import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGBarChartComponent } from './svg-bar-chart.component';

describe('SVGBarChartComponent', () => {
  let component: SVGBarChartComponent;
  let fixture: ComponentFixture<SVGBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SVGBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SVGBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
