import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationSidenavTabsComponent } from './simulation-sidenav-tabs.component';

describe('SimulationSidenavTabsComponent', () => {
  let component: SimulationSidenavTabsComponent;
  let fixture: ComponentFixture<SimulationSidenavTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationSidenavTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationSidenavTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
