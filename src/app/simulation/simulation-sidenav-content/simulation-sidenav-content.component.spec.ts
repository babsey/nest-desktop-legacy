import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationSidenavContentComponent } from './simulation-sidenav-content.component';

describe('SimulationSidenavContentComponent', () => {
  let component: SimulationSidenavContentComponent;
  let fixture: ComponentFixture<SimulationSidenavContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationSidenavContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationSidenavContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
