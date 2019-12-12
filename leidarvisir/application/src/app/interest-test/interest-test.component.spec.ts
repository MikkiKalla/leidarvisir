import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestTestComponent } from './interest-test.component';

describe('InterestTestComponent', () => {
  let component: InterestTestComponent;
  let fixture: ComponentFixture<InterestTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
