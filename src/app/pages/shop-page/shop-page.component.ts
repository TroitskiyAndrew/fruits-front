import { Component, computed, effect, signal } from '@angular/core';
import { Currency, ISet, Measure, Product } from '../../models/models';
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

import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';
import { StateService } from '../../services/state.service';
import { FormControl } from '@angular/forms';
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductCardComponent, ProductCardPlace } from "../../components/product-card/product-card.component";
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { CURRENCY_OPTIONS } from '../../constants/constants';


@Component({
  selector: 'shop-page',
  standalone: true,
  imports: [CommonModule, StackComponent, PageComponent, TogglerComponent, ProductCardComponent, PriceStringPipe, ButtonComponent],
  templateUrl: './shop-page.component.html'
})
export class ShopPageComponent {

  currencyOptions = CURRENCY_OPTIONS
  ProductCardPlace = ProductCardPlace;
  trigger = signal<boolean>(false)
  selectedSet = signal<string | null>(null)
  sets = computed(() => {
    const sets = this.stateService.products().filter(p => p.set);
    this.trigger()
    return sets;
  });
  cartTotal = computed(() => this.stateService.cartTotal());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  currency = computed(() => this.stateService.currency());


  constructor(private stateService: StateService) { }

  changeCurrency(currency: Currency){
    this.stateService.changeCurrency(currency)
  }

  selectSet(id: string) {
    this.selectedSet.set(id);
  }

  triggerSets() {
    this.trigger.set(!this.trigger())
  }

  cancelSelect() {
    this.triggerSets()
    this.selectedSet.set(null);
  }
  addToCart(product: ISet){
    this.stateService.updateCart([...this.stateService.cart(), {...product, count: 1}]);
  }

}
