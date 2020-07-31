import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationConfigComponent } from './simulation-config.component';

describe('SimulationConfigComponent', () => {
  let component: SimulationConfigComponent;
  let fixture: ComponentFixture<SimulationConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
