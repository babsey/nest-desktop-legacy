import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsConfigDialogComponent } from './forms-config-dialog.component';

describe('FormsConfigDialogComponent', () => {
  let component: FormsConfigDialogComponent;
  let fixture: ComponentFixture<FormsConfigDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsConfigDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
