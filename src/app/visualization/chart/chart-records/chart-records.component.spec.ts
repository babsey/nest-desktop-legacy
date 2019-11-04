import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartRecordsComponent } from './chart-records.component';

describe('ChartRecordsComponent', () => {
  let component: ChartRecordsComponent;
  let fixture: ComponentFixture<ChartRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
