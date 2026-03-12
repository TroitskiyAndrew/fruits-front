import { Component } from '@angular/core';
import { SetCardComponent } from '../../components/set-card/set-card.component';
import { ISet } from '../../models/models';
import { StackComponent } from '../../ui/stack/stack.component';
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


@Component({
  selector: 'shop-page',
  standalone: true,
  imports: [CommonModule, SetCardComponent, StackComponent, PageComponent],
  templateUrl: './shop-page.component.html'
})
export class ShopPageComponent {

  sets: ISet[] = [];

  editSet(set: ISet) { }

}
