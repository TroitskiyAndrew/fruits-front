import { Component } from '@angular/core';
import { PageComponent } from "../../ui/page/page.component";
import { OrderDeliveryComponent } from "../../components/order-delivery/order-delivery.component";

@Component({
  selector: 'delivery-page',
  imports: [PageComponent, OrderDeliveryComponent],
  templateUrl: './delivery-page.component.html',
  styleUrl: './delivery-page.component.scss'
})
export class DeliveryPageComponent {

}
