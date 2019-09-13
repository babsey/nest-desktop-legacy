import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationConfigComponent } from './visualization-config.component';

describe('VisualizationConfigComponent', () => {
  let component: VisualizationConfigComponent;
  let fixture: ComponentFixture<VisualizationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
