import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksSketchComponent } from './links-sketch.component';

describe('LinksSketchComponent', () => {
  let component: LinksSketchComponent;
  let fixture: ComponentFixture<LinksSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinksSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
