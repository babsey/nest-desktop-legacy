import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamComponent } from './model-param.component';

describe('ModelParamComponent', () => {
  let component: ModelParamComponent;
  let fixture: ComponentFixture<ModelParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
