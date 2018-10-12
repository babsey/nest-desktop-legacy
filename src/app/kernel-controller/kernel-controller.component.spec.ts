import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KernelControllerComponent } from './kernel-controller.component';

describe('KernelControllerComponent', () => {
  let component: KernelControllerComponent;
  let fixture: ComponentFixture<KernelControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KernelControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KernelControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
