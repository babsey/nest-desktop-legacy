import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamsSliderComponent } from './model-params-slider.component';

describe('ModelParamsSliderComponent', () => {
  let component: ModelParamsSliderComponent;
  let fixture: ComponentFixture<ModelParamsSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelParamsSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelParamsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
