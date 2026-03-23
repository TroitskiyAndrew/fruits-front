import { Component, computed } from '@angular/core';
import { DeliveryType, IOrderDelivery, PaymentMethod } from '../../models/models';
import { PageComponent } from '../../ui/page/page.component';
import { OrderDeliveryComponent } from '../../components/order-delivery/order-delivery.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { StateService } from '../../services/state.service';
import { ApiService } from '../../services/api.service';

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

  constructor(private stateService: StateService, private apiService: ApiService){}

  submitDeliveryValue(delivery: IOrderDelivery | null){
    if(delivery) {
      this.stateService.updateDelivery(delivery)
    }

  }

  createOrder(method: PaymentMethod){
    const order = this.stateService.order();
    this.apiService.createOrder(order, method);
    this.stateService.updateCart([])
  }
}
