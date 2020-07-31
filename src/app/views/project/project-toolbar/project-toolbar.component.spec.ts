import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationToolbarComponent } from './simulation-toolbar.component';

describe('SimulationToolbarComponent', () => {
  let component: SimulationToolbarComponent;
  let fixture: ComponentFixture<SimulationToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
