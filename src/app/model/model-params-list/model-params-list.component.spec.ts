import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamsListComponent } from './model-params-list.component';

describe('ModelParamsListComponent', () => {
  let component: ModelParamsListComponent;
  let fixture: ComponentFixture<ModelParamsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelParamsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelParamsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
