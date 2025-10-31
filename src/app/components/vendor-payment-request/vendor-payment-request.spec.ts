import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPaymentRequest } from './vendor-payment-request';

describe('VendorPaymentRequest', () => {
  let component: VendorPaymentRequest;
  let fixture: ComponentFixture<VendorPaymentRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorPaymentRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorPaymentRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
