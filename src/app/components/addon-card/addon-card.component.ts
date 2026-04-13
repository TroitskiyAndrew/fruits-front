import { Component, computed, EventEmitter, input, Input, Output } from '@angular/core';
import { Currency,  Product } from '../../models/models';
import { StackComponent } from "../../ui/stack/stack.component";
import { CardComponent } from "../../ui/card/card.component";
import { RowComponent } from "../../ui/row/row.component";
import { CheckboxComponent } from "../../ui/checkbox/checkbox.component";
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { CURRENCY_SYMBOLS, DEFAULT_CURRENCY } from '../../constants/constants';

export enum AddonCardPlace {
  Cart,
  OrderPage
}

@Component({
  selector: 'addon-card',
  imports: [StackComponent, CardComponent, RowComponent, CheckboxComponent, PriceStringPipe],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss'
})
export class AddonCardComponent {

  @Input() usage: AddonCardPlace = AddonCardPlace.Cart;
  AddonCardPlace = AddonCardPlace;
  @Input() addon!: Product
  currency = input(DEFAULT_CURRENCY);
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  isSelected = computed(() => this.stateService.cartAddons().find(a => a.id === this.addon.id) != null)
  addonPrice = computed(() => this.addon.price[this.currency()])

  @Output() selectAddon = new EventEmitter<boolean>();

  constructor(private stateService: StateService) {}

  changeAddonSelect() {
    this.selectAddon.emit(!this.isSelected())
  }

}
