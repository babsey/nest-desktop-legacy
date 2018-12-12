import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGLineChartComponent } from './svg-line-chart.component';

describe('SVGLineChartComponent', () => {
  let component: SVGLineChartComponent;
  let fixture: ComponentFixture<SVGLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SVGLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SVGLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
