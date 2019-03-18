import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfigComponent } from './app-config.component';

describe('AppConfigComponent', () => {
  let component: AppConfigComponent;
  let fixture: ComponentFixture<AppConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
