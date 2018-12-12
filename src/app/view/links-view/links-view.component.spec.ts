import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksViewComponent } from './links-view.component';

describe('LinksViewComponent', () => {
  let component: LinksViewComponent;
  let fixture: ComponentFixture<LinksViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinksViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
