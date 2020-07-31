import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOptgroupComponent } from './select-optgroup.component';

describe('SelectOptgroupComponent', () => {
  let component: SelectOptgroupComponent;
  let fixture: ComponentFixture<SelectOptgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOptgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOptgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
