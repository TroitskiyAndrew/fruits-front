import { Component, Input } from '@angular/core';
import { IOrderStatus } from '../../models/models';
import { CardComponent } from "../../ui/card/card.component";
import { StackComponent } from "../../ui/stack/stack.component";

@Component({
  selector: 'order-status',
  imports: [ StackComponent],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss'
})
export class OrderStatusComponent {
  @Input() status!: IOrderStatus;

}
