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

@Component({
  selector: 'app-online-payment-page',
  imports: [PageComponent, ButtonComponent, TogglerComponent, PriceStringPipe],
  templateUrl: './online-payment-page.component.html',
  styleUrl: './online-payment-page.component.scss'
})
export class OnlinePaymentPageComponent {

  payment = signal<IPayment | null>(null)

  currencyOptions = CURRENCY_OPTIONS;

  currency = computed(() => this.stateService.currency());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  total = computed(() => this.payment()?.amounts[this.currency()] || 0);

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router,  private route: ActivatedRoute) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('paymentId');
    const payment = this.stateService.paymentsMap().get(id || '');
    if (payment) {
      this.payment.set(payment);
    }
  }

  changeCurrency(currency: Currency) {
    this.stateService.changeCurrency(currency)
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const image = await this.apiService.uploadPhoto(file);
    const formData = new FormData();
    formData.append('currency', this.currency());
    formData.append('image', image);
    formData.append('when', Date.now().toString());
    formData.append('amount', this.stateService.cartTotal().toString());
    formData.append('paymentId', this.stateService.paymentId);
    const isPayed = await this.apiService.pay(formData)
    this.router.navigate(['order-placed']);
  }

}
