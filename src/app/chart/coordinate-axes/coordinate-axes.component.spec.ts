import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinateAxesComponent } from './coordinate-axes.component';

describe('CoordinateAxesComponent', () => {
  let component: CoordinateAxesComponent;
  let fixture: ComponentFixture<CoordinateAxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoordinateAxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoordinateAxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
