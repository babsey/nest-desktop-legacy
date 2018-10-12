import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDescriptionComponent } from './model-description.component';

describe('ModelDescriptionComponent', () => {
  let component: ModelDescriptionComponent;
  let fixture: ComponentFixture<ModelDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
