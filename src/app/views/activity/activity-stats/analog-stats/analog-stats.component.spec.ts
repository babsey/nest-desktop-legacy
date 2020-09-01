import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalogStatsComponent } from './analog-stats.component';

describe('AnalogStatsComponent', () => {
  let component: AnalogStatsComponent;
  let fixture: ComponentFixture<AnalogStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalogStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalogStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
