import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSketchComponent } from './link-sketch.component';

describe('LinkSketchComponent', () => {
  let component: LinkSketchComponent;
  let fixture: ComponentFixture<LinkSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
