import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelConfigDialogComponent } from './model-config-dialog.component';

describe('ModelConfigDialogComponent', () => {
  let component: ModelConfigDialogComponent;
  let fixture: ComponentFixture<ModelConfigDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelConfigDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
