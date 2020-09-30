import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDocumentationComponent } from './model-documentation.component';

describe('ModelDocumentationComponent', () => {
  let component: ModelDocumentationComponent;
  let fixture: ComponentFixture<ModelDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDocumentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
