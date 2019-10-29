import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkProjectionsComponent } from './link-projections.component';

describe('LinkProjectionsComponent', () => {
  let component: LinkProjectionsComponent;
  let fixture: ComponentFixture<LinkProjectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkProjectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkProjectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
