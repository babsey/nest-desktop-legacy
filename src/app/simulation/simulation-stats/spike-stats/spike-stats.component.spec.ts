import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpikeStatsComponent } from './spike-stats.component';

describe('SpikeStatsComponent', () => {
  let component: SpikeStatsComponent;
  let fixture: ComponentFixture<SpikeStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpikeStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpikeStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
