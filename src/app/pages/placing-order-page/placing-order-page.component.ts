import { Component, computed } from '@angular/core';
import { DeliveryType, IOrderDelivery, PaymentMethod } from '../../models/models';
import { PageComponent } from '../../ui/page/page.component';
import { OrderDeliveryComponent, OrderDeliveryPlace } from '../../components/order-delivery/order-delivery.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { LoaderDirective } from '../../ui/loader/loader.directive';

@Component({
  selector: 'placing-order-page',
  imports: [PageComponent, OrderDeliveryComponent, ButtonComponent],
  templateUrl: './placing-order-page.component.html',
  styleUrl: './placing-order-page.component.scss'
})
export class PlacingOrderPageComponent {
  delivery = computed(() => this.stateService.orderDelivery());
  DeliveryType = DeliveryType;
  PaymentMethod = PaymentMethod;
  OrderDeliveryPlace = OrderDeliveryPlace
  canCreateOrder = false;

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router){}

  submitDeliveryValue(delivery: IOrderDelivery | null){
    if(delivery) {
      this.stateService.updateDelivery(delivery);
      this.canCreateOrder = true;
    } else {
      this.canCreateOrder = false
    }
  }

  async createOrder(method: PaymentMethod){
    const order = this.stateService.order();
    this.stateService.load(true);
    const newOrderInfo = await this.apiService.createOrder(order, method);
    this.stateService.load(false);
    if(newOrderInfo){
      const {order, payment} = newOrderInfo;
      this.stateService.orders.update((orders) => [...orders, order]);
      this.stateService.payments.update((payments) => [...payments, payment]);
      if(method === PaymentMethod.Bank) {
        this.router.navigate(['online-payment', payment.id]);
      } else {
        this.stateService.dropOrder();
        this.router.navigate(['order-placed']);
      }

    }
  }
}
