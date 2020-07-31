import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSelectionComponent } from './node-selection.component';

describe('NodeSelectionComponent', () => {
  let component: NodeSelectionComponent;
  let fixture: ComponentFixture<NodeSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
