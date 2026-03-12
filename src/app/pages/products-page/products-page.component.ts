import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { SetCardComponent } from '../../components/set-card/set-card.component';
import { IProduct, ISet } from '../../models/models';
import { ButtonComponent } from '../../ui/button/button.component';
import { StackComponent } from '../../ui/stack/stack.component';
import { InputComponent } from '../../ui/input/input.component';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';
import { PriceComponent } from '../../ui/price/price.component';
import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';


@Component({
  selector: 'products-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, StackComponent, SetCardComponent, ProductCardComponent, PageComponent],
  templateUrl: './products-page.component.html'
})
export class ProductsPageComponent {

  search = new FormControl('');

  products: (IProduct | ISet)[] = [];

  createProduct() { }

  editProduct(product: IProduct) { }

  editSet(set: ISet) { }

}
