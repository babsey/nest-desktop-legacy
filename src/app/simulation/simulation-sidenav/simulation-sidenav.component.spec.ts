import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationSidenavComponent } from './simulation-sidenav.component';

describe('SimulationSidenavComponent', () => {
  let component: SimulationSidenavComponent;
  let fixture: ComponentFixture<SimulationSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
