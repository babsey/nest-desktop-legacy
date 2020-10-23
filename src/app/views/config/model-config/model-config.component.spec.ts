import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelConfigComponent } from './model-config.component';

describe('ModelConfigComponent', () => {
  let component: ModelConfigComponent;
  let fixture: ComponentFixture<ModelConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
