import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePaymentPageComponent } from './online-payment-page.component';

describe('OnlinePaymentPageComponent', () => {
  let component: OnlinePaymentPageComponent;
  let fixture: ComponentFixture<OnlinePaymentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlinePaymentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlinePaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
