import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingDetailsComponent } from './loading-details.component';

describe('LoadingDetailsComponent', () => {
  let component: LoadingDetailsComponent;
  let fixture: ComponentFixture<LoadingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
