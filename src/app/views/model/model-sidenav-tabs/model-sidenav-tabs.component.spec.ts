import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSidenavTabsComponent } from './model-sidenav-tabs.component';

describe('ModelSidenavTabsComponent', () => {
  let component: ModelSidenavTabsComponent;
  let fixture: ComponentFixture<ModelSidenavTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelSidenavTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelSidenavTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
