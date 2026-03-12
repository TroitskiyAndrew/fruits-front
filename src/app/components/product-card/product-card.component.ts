import { Component, Input } from '@angular/core';
import { IProduct } from '../../models/models';
import { CardComponent } from '../../ui/card/card.component';
import { PriceComponent } from '../../ui/price/price.component';
import { RowComponent } from '../../ui/row/row.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { InputComponent } from '../../ui/input/input.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';
import { SectionComponent } from '../../ui/section/section.component';
import { StackComponent } from '../../ui/stack/stack.component';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, PriceComponent, RowComponent,],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {

  @Input() product!: IProduct

}
