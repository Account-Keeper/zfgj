import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepingRenewComponent } from './keeping-renew.component';

describe('KeepingRenewComponent', () => {
  let component: KeepingRenewComponent;
  let fixture: ComponentFixture<KeepingRenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeepingRenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeepingRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
