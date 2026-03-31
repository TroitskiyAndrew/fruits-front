import { Component, computed, effect, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { Currency, IPayment, IPayOptions, IUser, OnlinePaymentOption, PaymentMethod } from '../../models/models';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { InputComponent } from '../../ui/input/input.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';

import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';
import { StackComponent } from '../../ui/stack/stack.component';
import { CURRENCY_OPTIONS } from '../../constants/constants';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { getEmptyUser } from '../../services/utils';

export enum PaymentCardPlace {
  OnlinePayment
}

@Component({
  selector: 'payment-card',
  imports: [CommonModule, CardComponent, TogglerComponent, ButtonComponent, PriceStringPipe, StackComponent, RowComponent],
  standalone: true,
  templateUrl: './payment-card.component.html'
})
export class PaymentCardComponent {

  @Input() payment: IPayment = {
    id: '',
    from: 0,
    to: 0,
    amount: 0,
    currency: Currency.Rub,
    amounts: {
      rub: 0,
      vnd: 0,
      usdt: 0
    },
    method: PaymentMethod.Bank,
    payed: null,
    confirmed: null,
    image: ''
  };
  @Input() usage: PaymentCardPlace = PaymentCardPlace.OnlinePayment;
  PaymentCardPlace = PaymentCardPlace;
  OnlinePaymentOption = OnlinePaymentOption;
  currencyOptions = CURRENCY_OPTIONS;

  @Output() payed = new EventEmitter<boolean>()

  currency = computed(() => this.stateService.currency());
  currencySymbol = computed(() => this.stateService.currencySymbol());

  total = computed(() => this.payment.amounts[this.currency()] || 0);
  from = signal<IUser>(getEmptyUser());
  to = signal<IUser>(getEmptyUser());
  paymentMethod = computed(() => this.to().paymentMethods[this.currency()] || null);

  constructor(private stateService: StateService, private apiService: ApiService) {


  }

  async ngOnInit() {
    const payment = this.payment;
      const [from, to] = await Promise.all([
        this.apiService.getUser(payment.from),
        this.apiService.getUser(payment.to)
      ])
      if (from) {
        this.from.set(from);
      }
      if (to) {
        this.to.set(to);
      }
  }

  changeCurrency(currency: Currency) {
    this.stateService.changeCurrency(currency)
  }

  async downloadQR(qr: string) {
    const response = await fetch(qr);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr.png';
    link.click();

    window.URL.revokeObjectURL(url);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const image = await this.apiService.uploadPhoto(file);
    const options: IPayOptions = {
      currency: this.currency(),
      image,
      when: Date.now(),
      amount: this.payment.amount,
      method: PaymentMethod.Bank,
      paymentId: this.payment.id
    }
    const isPayed = await this.apiService.pay(options);
    this.payed.emit(isPayed)
  }

}
