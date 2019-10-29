import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkParamComponent } from './link-param.component';

describe('LinkParamComponent', () => {
  let component: LinkParamComponent;
  let fixture: ComponentFixture<LinkParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
