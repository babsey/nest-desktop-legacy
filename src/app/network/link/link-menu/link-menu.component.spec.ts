import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkMenuComponent } from './link-menu.component';

describe('LinkMenuComponent', () => {
  let component: LinkMenuComponent;
  let fixture: ComponentFixture<LinkMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
