import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsiChartComponent } from './isi-chart.component';

describe('IsiChartComponent', () => {
  let component: IsiChartComponent;
  let fixture: ComponentFixture<IsiChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsiChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsiChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
