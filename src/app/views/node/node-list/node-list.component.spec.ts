import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesListComponent } from './node-list.component';

describe('NodesListComponent', () => {
  let component: NodesListComponent;
  let fixture: ComponentFixture<NodesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
