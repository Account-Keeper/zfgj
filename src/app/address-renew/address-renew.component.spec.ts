import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressRenewComponent } from './address-renew.component';

describe('AddressRenewComponent', () => {
  let component: AddressRenewComponent;
  let fixture: ComponentFixture<AddressRenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressRenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
