import { Component, Input } from '@angular/core';
import { IOrderStatus } from '../../models/models';
import { CardComponent } from "../../ui/card/card.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { RowComponent } from "../../ui/row/row.component";
import { CommonModule } from '@angular/common';

export enum OrderStatusPlace {
  OrderPage,
}

@Component({
  selector: 'order-status',
  imports: [CommonModule, StackComponent, RowComponent],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss'
})
export class OrderStatusComponent {
  @Input() status!: IOrderStatus;
  @Input() usage: OrderStatusPlace = OrderStatusPlace.OrderPage;
  OrderStatusPlace = OrderStatusPlace

}
