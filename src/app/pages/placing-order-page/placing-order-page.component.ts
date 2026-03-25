import { Component, computed } from '@angular/core';
import { DeliveryType, IOrderDelivery, PaymentMethod } from '../../models/models';
import { PageComponent } from '../../ui/page/page.component';
import { OrderDeliveryComponent } from '../../components/order-delivery/order-delivery.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

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

  createOrder(method: PaymentMethod){
    const order = this.stateService.order();
    // this.apiService.createOrder(order, method);
    this.router.navigate(method === PaymentMethod.Bank ? ['online-payment'] : ['order-placed'])
  }
}
