import { Component, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent, ProductCardPlace } from '../../components/product-card/product-card.component';
import { Currency, Product, ProductType, Set } from '../../models/models';
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

import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';
import { StateService } from '../../services/state.service';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'products-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent, StackComponent, ProductCardComponent, PageComponent],
  templateUrl: './products-page.component.html'
})
export class ProductsPageComponent {

  creating = false;

  createType: 'product' | 'set' = 'product';

  ProductCardPlace = ProductCardPlace

  searchControl = new FormControl('');

  search = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  products = computed(() => {
    const searchValue = this.search()?.toLowerCase() || '';
    let products = this.stateService.products();
    if(searchValue) {
      products = products.filter(p => p.name.toLowerCase().includes(searchValue))
    }
    return products
      .sort((a, b) => {
        const valA = a.type === ProductType.Set ? -1 : a.type
        const valB = b.type === ProductType.Set ? -1 : b.type
        return valA - valB
      });
  });

  constructor(private stateService: StateService) { }

  createProduct() { }

  editProduct(product: Product) { }

  editSet(set: Set) { }

  addProduct(product: Product) {

    this.creating = false;

  }

}
