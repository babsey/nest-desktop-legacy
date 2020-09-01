import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsuiteComponent } from './testsuite.component';

describe('TestsuiteComponent', () => {
  let component: TestsuiteComponent;
  let fixture: ComponentFixture<TestsuiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsuiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
