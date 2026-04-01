import { Component, computed, effect, input, Input, signal } from '@angular/core';
import { Currency, IOrder } from '../../models/models';
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
import { StateService } from '../../services/state.service';
import { CURRENCY_SYMBOLS } from '../../constants/constants';
import { getEmptyUser, getUserName } from '../../services/utils';
import { ApiService } from '../../services/api.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { OrderStatusComponent } from "../order-status/order-status.component";

export enum OrderCardPlace {
  OrderPage,
}

@Component({
  selector: 'order-card',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    RowComponent,
    StackComponent,
    PriceStringPipe,
    OrderStatusComponent
],
  templateUrl: './order-card.component.html',
})
export class OrderCardComponent {
  @Input() order!: IOrder;
  @Input() usage: OrderCardPlace = OrderCardPlace.OrderPage;
  OrderCardPlace = OrderCardPlace;

  _currency = input(Currency.VND);
  currency = signal(Currency.VND);
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  Currency = Currency;
  user = signal(getEmptyUser());
  totalPrice = computed(() => this.order.content.prices[this.currency()] || 0);
  name = computed(() => getUserName(this.user()));
  username = computed(() => this.user().user.username);
  get content() {
    return this.order.content;
  }
  get delivery() {
    return this.order.delivery;
  }
  get status() {
    return this.order.status;
  }

  constructor(private stateService: StateService, private apiService: ApiService) {
    effect(() => this.currency.set(this._currency()));
  }

  async ngOnInit() {
    const user = await this.apiService.getUser(this.order.userId);
    if (user) {
      this.user.set(user);
    }
  }
}
