import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSplitControllerComponent } from './chart-split-controller.component';

describe('ChartSplitControllerComponent', () => {
  let component: ChartSplitControllerComponent;
  let fixture: ComponentFixture<ChartSplitControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSplitControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSplitControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
