import { Component, signal } from '@angular/core';
import { PageComponent } from "../../ui/page/page.component";
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentCardPlace } from '../../components/payment-card/payment-card.component';
import { Currency, IOrder, IPayment } from '../../models/models';
import { ApiService } from '../../services/api.service';
import { StateService } from '../../services/state.service';
import { OrderCardComponent, OrderCardPlace } from "../../components/order-card/order-card.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { CURRENCY_OPTIONS } from '../../constants/constants';

@Component({
  selector: 'app-order-page',
  imports: [PageComponent, OrderCardComponent],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.scss'
})
export class OrderPageComponent {

  orderSignal = signal<IOrder | null>(null);
  OrderCardPlace = OrderCardPlace;
  currency = signal(Currency.Rub);
  currencyOptions = CURRENCY_OPTIONS

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router,  private route: ActivatedRoute) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('orderId') || '';
    this.stateService.load(true);
    const order = await this.apiService.getOrder(id);
    if (order) {
      this.orderSignal.set(order);
      this.currency.set(order.content.currency);
      console.log(order);
    }
    this.stateService.load(false);
  }

}
