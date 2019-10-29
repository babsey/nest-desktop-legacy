import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkSketchControllerComponent } from './network-sketch-controller.component';

describe('NetworkSketchControllerComponent', () => {
  let component: NetworkSketchControllerComponent;
  let fixture: ComponentFixture<NetworkSketchControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkSketchControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkSketchControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
