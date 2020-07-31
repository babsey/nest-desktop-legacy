import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestServerComponent } from './nest-server.component';

describe('NestServerComponent', () => {
  let component: NestServerComponent;
  let fixture: ComponentFixture<NestServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NestServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
