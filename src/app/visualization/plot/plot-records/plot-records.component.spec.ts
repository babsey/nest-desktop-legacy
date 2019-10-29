import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotRecordsComponent } from './plot-records.component';

describe('PlotRecordsComponent', () => {
  let component: PlotRecordsComponent;
  let fixture: ComponentFixture<PlotRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
