import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkScriptComponent } from './network-script.component';

describe('NetworkScriptComponent', () => {
  let component: NetworkScriptComponent;
  let fixture: ComponentFixture<NetworkScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkScriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
