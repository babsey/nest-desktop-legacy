import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesViewComponent } from './nodes-view.component';

describe('NodesViewComponent', () => {
  let component: NodesViewComponent;
  let fixture: ComponentFixture<NodesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
