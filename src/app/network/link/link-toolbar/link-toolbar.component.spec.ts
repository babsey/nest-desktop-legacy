import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkToolbarComponent } from './link-toolbar.component';

describe('LinkToolbarComponent', () => {
  let component: LinkToolbarComponent;
  let fixture: ComponentFixture<LinkToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
