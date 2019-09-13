import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSketchComponent } from './network-sketch.component';

describe('NetworkSketchComponent', () => {
  let component: NetworkSketchComponent;
  let fixture: ComponentFixture<NetworkSketchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkSketchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSketchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
