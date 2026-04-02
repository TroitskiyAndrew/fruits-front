import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderCardComponent, OrderCardPlace } from '../../components/order-card/order-card.component';
import { IOrder } from '../../models/models';
import { InputComponent } from '../../ui/input/input.component';
import { StackComponent } from '../../ui/stack/stack.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';

import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';
import { ApiService } from '../../services/api.service';
import { StateService } from '../../services/state.service';



@Component({
  selector: 'orders-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StackComponent, OrderCardComponent, PageComponent],
  templateUrl: './orders-page.component.html'
})
export class OrdersPageComponent {

  orders: IOrder[] = [];

  OrderCardPlace = OrderCardPlace;

  constructor(private stateService: StateService, private apiService: ApiService) {}

  async ngOnInit(){
    this.stateService.load(true);
    this.orders = await this.apiService.getOrders({});
    console.log(this.orders);
    this.stateService.load(false);
  }

}
