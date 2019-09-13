import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationShortListComponent } from './simulation-short-list.component';

describe('SimulationShortListComponent', () => {
  let component: SimulationShortListComponent;
  let fixture: ComponentFixture<SimulationShortListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationShortListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationShortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
