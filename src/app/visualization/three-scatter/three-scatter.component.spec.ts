import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeScatterComponent } from './three-scatter.component';

describe('ThreeScatterComponent', () => {
  let component: ThreeScatterComponent;
  let fixture: ComponentFixture<ThreeScatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeScatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
