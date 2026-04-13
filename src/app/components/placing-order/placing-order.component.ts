import { Component, computed, effect, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Currency, IOrderDelivery, PaymentMethod } from '../../models/models';
import { ApiService } from '../../services/api.service';
import { StateService } from '../../services/state.service';
import { CURRENCY_SYMBOLS } from '../../constants/constants';
import { OrderDeliveryComponent, OrderDeliveryPlace } from "../order-delivery/order-delivery.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { CardComponent } from "../../ui/card/card.component";

@Component({
  selector: 'placing-order',
  imports: [OrderDeliveryComponent, StackComponent, ButtonComponent, CardComponent],
  templateUrl: './placing-order.component.html',
  styleUrl: './placing-order.component.scss'
})
export class PlacingOrderComponent {

  _currency = input(Currency.VND);
  currency = signal(Currency.VND)
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  canCreateOrder = false;
  OrderDeliveryPlace = OrderDeliveryPlace

  delivery = computed<IOrderDelivery>(() => this.stateService.orderDelivery());
  PaymentMethod = PaymentMethod;

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router) {
    effect(() => this.currency.set(this._currency()));
  }

  submitDeliveryValue(delivery: IOrderDelivery | null) {
    if (delivery) {
      this.stateService.updateDelivery(delivery);
      this.canCreateOrder = true;
    } else {
      this.canCreateOrder = false
    }
  }

  async createOrder(method: PaymentMethod) {
    const order = this.stateService.order();
    this.stateService.load(true);
    const newOrderInfo = await this.apiService.createOrder(order, method);
    this.stateService.load(false);
    if (newOrderInfo) {
      const { order, payment } = newOrderInfo;
      this.stateService.orders.update((orders) => [...orders, order]);
      this.stateService.payments.update((payments) => [...payments, payment]);
      if (method === PaymentMethod.Bank) {
        this.router.navigate(['online-payment', payment.id]);
      } else {
        this.stateService.dropOrder();
        this.router.navigate(['order-placed']);
      }

    }
  }

}
