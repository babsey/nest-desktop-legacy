import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelActivityGraphComponent } from './model-activity-graph.component';

describe('ModelActivityGraphComponent', () => {
  let component: ModelActivityGraphComponent;
  let fixture: ComponentFixture<ModelActivityGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelActivityGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelActivityGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
