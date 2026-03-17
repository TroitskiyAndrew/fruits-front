import { Component, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { IProduct, ISet, Currency } from '../../models/models';
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

  searchControl = new FormControl('');

  search = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  products = computed(() => {
    const searchValue = this.search()?.toLowerCase() || '';

    return this.stateService.products()
      .filter(p => p.name.toLowerCase().includes(searchValue))
      .sort((a, b) => (b.set ? 1 : 0) - (a.set ? 1 : 0));
  });

  constructor(private stateService: StateService) { }

  createProduct() { }

  editProduct(product: IProduct) { }

  editSet(set: ISet) { }

  addProduct(product: IProduct | ISet) {

    this.creating = false;

  }

}
