import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsVisualizationComponent } from './records-visualization.component';

describe('RecordsVisualizationComponent', () => {
  let component: RecordsVisualizationComponent;
  let fixture: ComponentFixture<RecordsVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordsVisualizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
