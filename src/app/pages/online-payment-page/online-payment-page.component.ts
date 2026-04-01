import { Component, computed, signal } from '@angular/core';
import { PageComponent } from "../../ui/page/page.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { CURRENCY_OPTIONS } from '../../constants/constants';
import { StateService } from '../../services/state.service';
import { Currency, IPayment } from '../../models/models';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentCardComponent, PaymentCardPlace } from "../../components/payment-card/payment-card.component";

@Component({
  selector: 'app-online-payment-page',
  imports: [PageComponent, PaymentCardComponent],
  templateUrl: './online-payment-page.component.html',
  styleUrl: './online-payment-page.component.scss'
})
export class OnlinePaymentPageComponent {

  paymentSignal = signal<IPayment | null>(null);
  PaymentCardPlace = PaymentCardPlace;

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router,  private route: ActivatedRoute) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('paymentId') || '';
    const payment = await this.apiService.getPayment(id);
    if (payment) {
      this.paymentSignal.set(payment);
    }
  }

  paid(success: boolean){
    if (success) {
      this.stateService.dropOrder();
      this.router.navigate(['/order-placed']);
    }
  }
}
