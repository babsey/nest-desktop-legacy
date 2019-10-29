import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkMaskComponent } from './link-mask.component';

describe('LinkMaskComponent', () => {
  let component: LinkMaskComponent;
  let fixture: ComponentFixture<LinkMaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkMaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
