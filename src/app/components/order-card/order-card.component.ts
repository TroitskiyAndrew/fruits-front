import { Component, Input } from '@angular/core';
import { IOrder } from '../../models/models';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { InputComponent } from '../../ui/input/input.component';
import { ListComponent } from '../../ui/list/list.component';

import { PageComponent } from '../../ui/page/page.component';
import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';
import { StackComponent } from '../../ui/stack/stack.component';

@Component({
  selector: 'order-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, CardComponent, RowComponent, StackComponent],
  templateUrl: './order-card.component.html'
})
export class OrderCardComponent {

  @Input() order!: IOrder

}
