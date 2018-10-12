import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayGeneratorDialogComponent } from './array-generator-dialog.component';

describe('ArrayGeneratorDialogComponent', () => {
  let component: ArrayGeneratorDialogComponent;
  let fixture: ComponentFixture<ArrayGeneratorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrayGeneratorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayGeneratorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
