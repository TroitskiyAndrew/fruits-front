import { Component, computed } from '@angular/core';
import { PageComponent } from "../../ui/page/page.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { CURRENCY_OPTIONS } from '../../constants/constants';
import { StateService } from '../../services/state.service';
import { Currency } from '../../models/models';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-payment-page',
  imports: [PageComponent, ButtonComponent, TogglerComponent, PriceStringPipe],
  templateUrl: './online-payment-page.component.html',
  styleUrl: './online-payment-page.component.scss'
})
export class OnlinePaymentPageComponent {

  currencyOptions = CURRENCY_OPTIONS;

  currency = computed(() => this.stateService.currency());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  total = computed(() => this.stateService.cartTotal());

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router) { }

  changeCurrency(currency: Currency) {
    this.stateService.changeCurrency(currency)
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('currency', this.currency());
    formData.append('when', Date.now().toString());
    formData.append('amount', this.stateService.cartTotal().toString());
    this.router.navigate(['order-placed']);
  }

}
