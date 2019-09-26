import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestServerConfigComponent } from './nest-server-config.component';

describe('NestServerConfigComponent', () => {
  let component: NestServerConfigComponent;
  let fixture: ComponentFixture<NestServerConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestServerConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestServerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
