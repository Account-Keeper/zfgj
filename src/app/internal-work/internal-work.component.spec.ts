import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalWorkComponent } from './internal-work.component';

describe('InternalWorkComponent', () => {
  let component: InternalWorkComponent;
  let fixture: ComponentFixture<InternalWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
