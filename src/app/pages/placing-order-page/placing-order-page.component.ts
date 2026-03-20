import { Component } from '@angular/core';
import { IOrderDelivery } from '../../models/models';
import { PageComponent } from '../../ui/page/page.component';
import { OrderDeliveryComponent } from '../../components/order-delivery/order-delivery.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'placing-order-page',
  imports: [PageComponent, OrderDeliveryComponent, ButtonComponent],
  templateUrl: './placing-order-page.component.html',
  styleUrl: './placing-order-page.component.scss'
})
export class PlacingOrderPageComponent {
  delivery: IOrderDelivery | null = null;

  submitDeliveryValue(delivery: IOrderDelivery | null){
    this.delivery = delivery;
  }
}
