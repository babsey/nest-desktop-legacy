import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationControllerComponent } from './visualization-controller.component';

describe('VisualizationControllerComponent', () => {
  let component: VisualizationControllerComponent;
  let fixture: ComponentFixture<VisualizationControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
