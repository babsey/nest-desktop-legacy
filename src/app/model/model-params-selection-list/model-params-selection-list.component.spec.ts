import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelParamsSelectionListComponent } from './model-params-selection-list.component';

describe('ModelParamsSelectionListComponent', () => {
  let component: ModelParamsSelectionListComponent;
  let fixture: ComponentFixture<ModelParamsSelectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelParamsSelectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelParamsSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
