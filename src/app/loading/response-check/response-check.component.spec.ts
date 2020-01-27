import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseCheckComponent } from './response-check.component';

describe('ResponseCheckComponent', () => {
  let component: ResponseCheckComponent;
  let fixture: ComponentFixture<ResponseCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
