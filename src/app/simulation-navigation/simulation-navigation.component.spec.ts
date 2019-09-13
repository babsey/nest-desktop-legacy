import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationNavigationComponent } from './simulation-navigation.component';

describe('SimulationNavigationComponent', () => {
  let component: SimulationNavigationComponent;
  let fixture: ComponentFixture<SimulationNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
