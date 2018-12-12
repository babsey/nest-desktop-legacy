import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerSheetComponent } from './controller-sheet.component';

describe('ControllerSheetComponent', () => {
  let component: ControllerSheetComponent;
  let fixture: ComponentFixture<ControllerSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
