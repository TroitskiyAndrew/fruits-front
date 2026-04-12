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
  imports: [PageComponent, OrderDeliveryComponent],
  templateUrl: './placing-order-page.component.html',
  styleUrl: './placing-order-page.component.scss'
})
export class PlacingOrderPageComponent {
  delivery = computed(() => this.stateService.orderDelivery());
  DeliveryType = DeliveryType;
  PaymentMethod = PaymentMethod;
  OrderDeliveryPlace = OrderDeliveryPlace
  canCreateOrder = false;

  constructor(private stateService: StateService){}
}
