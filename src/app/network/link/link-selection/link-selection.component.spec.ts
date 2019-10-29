import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSelectionComponent } from './link-selection.component';

describe('LinkSelectionComponent', () => {
  let component: LinkSelectionComponent;
  let fixture: ComponentFixture<LinkSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
