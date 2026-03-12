import { Component } from '@angular/core';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { PaymentCardComponent } from '../../components/payment-card/payment-card.component';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { IUser, Order, IPayment } from '../../models/models';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { InputComponent } from '../../ui/input/input.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';
import { PriceComponent } from '../../ui/price/price.component';
import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';
import { StackComponent } from '../../ui/stack/stack.component';


@Component({
  selector: 'user-profile-page',
  standalone: true,
  imports: [CommonModule, UserCardComponent,
    OrderCardComponent,
    PaymentCardComponent],
  templateUrl: './user-profile-page.component.html'
})
export class UserProfilePageComponent {

  user!: IUser;

  orders: Order[] = [];

  payments: IPayment[] = [];

}
