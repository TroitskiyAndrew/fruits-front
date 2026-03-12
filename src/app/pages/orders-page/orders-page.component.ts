import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { Order } from '../../models/models';
import { InputComponent } from '../../ui/input/input.component';
import { StackComponent } from '../../ui/stack/stack.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';
import { PriceComponent } from '../../ui/price/price.component';
import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';



@Component({
  selector: 'orders-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, StackComponent, OrderCardComponent],
  templateUrl: './orders-page.component.html'
})
export class OrdersPageComponent {

  userFilter = new FormControl('');
  priceFilter = new FormControl('');

  orders: Order[] = [];

}
