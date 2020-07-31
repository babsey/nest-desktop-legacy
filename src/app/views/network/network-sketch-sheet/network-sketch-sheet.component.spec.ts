import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSketchSheetComponent } from './network-sketch-sheet.component';

describe('NetworkSketchSheetComponent', () => {
  let component: NetworkSketchSheetComponent;
  let fixture: ComponentFixture<NetworkSketchSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkSketchSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSketchSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
