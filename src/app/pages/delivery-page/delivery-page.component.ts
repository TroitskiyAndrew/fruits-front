import { Component } from '@angular/core';
import { PageComponent } from "../../ui/page/page.component";
import { OrderDeliveryComponent } from "../../components/order-delivery/order-delivery.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { StateService } from '../../services/state.service';

@Component({
  selector: 'delivery-page',
  imports: [PageComponent, OrderDeliveryComponent, ButtonComponent],
  templateUrl: './delivery-page.component.html',
  styleUrl: './delivery-page.component.scss'
})
export class DeliveryPageComponent {

  constructor(public stateService: StateService){}

}
