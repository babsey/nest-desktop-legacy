import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelActivitySpikeResponseComponent } from './model-activity-spike-response.component';

describe('ModelActivitySpikeResponseComponent', () => {
  let component: ModelActivitySpikeResponseComponent;
  let fixture: ComponentFixture<ModelActivitySpikeResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelActivitySpikeResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelActivitySpikeResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
