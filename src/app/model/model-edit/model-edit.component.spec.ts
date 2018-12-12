import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelConfigurationComponent } from './model-configuration.component';

describe('ModelConfigurationComponent', () => {
  let component: ModelConfigurationComponent;
  let fixture: ComponentFixture<ModelConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
