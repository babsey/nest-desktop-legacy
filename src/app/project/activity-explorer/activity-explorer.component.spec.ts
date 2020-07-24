import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityExplorerComponent } from './activity-explorer.component';

describe('ActivityExplorerComponent', () => {
  let component: ActivityExplorerComponent;
  let fixture: ComponentFixture<ActivityExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
