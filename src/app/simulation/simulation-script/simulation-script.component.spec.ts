import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationScriptComponent } from './simulation-script.component';

describe('SimulationScriptComponent', () => {
  let component: SimulationScriptComponent;
  let fixture: ComponentFixture<SimulationScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
