import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsthChartComponent } from './psth-chart.component';

describe('PsthChartComponent', () => {
  let component: PsthChartComponent;
  let fixture: ComponentFixture<PsthChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsthChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsthChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
