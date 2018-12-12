import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGScatterChartComponent } from './svg-scatter-chart.component';

describe('SVGScatterChartComponent', () => {
  let component: SVGScatterChartComponent;
  let fixture: ComponentFixture<SVGScatterChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SVGScatterChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SVGScatterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
