import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGAreaChartComponent } from './svg-area-chart.component';

describe('SVGAreaChartComponent', () => {
  let component: SVGAreaChartComponent;
  let fixture: ComponentFixture<SVGAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SVGAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SVGAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
