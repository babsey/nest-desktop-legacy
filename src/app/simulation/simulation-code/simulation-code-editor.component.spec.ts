import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationCodeEditorComponent } from './simulation-code-editor.component';

describe('SimulationCodeEditorComponent', () => {
  let component: SimulationCodeEditorComponent;
  let fixture: ComponentFixture<SimulationCodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationCodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
