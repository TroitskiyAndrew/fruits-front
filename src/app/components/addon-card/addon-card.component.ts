import { Component, computed, EventEmitter, input, Input, Output } from '@angular/core';
import { Addon, Currency,  Delivery,  Product, ProductType } from '../../models/models';
import { StackComponent } from "../../ui/stack/stack.component";
import { CardComponent } from "../../ui/card/card.component";
import { RowComponent } from "../../ui/row/row.component";
import { CheckboxComponent } from "../../ui/checkbox/checkbox.component";
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { CURRENCY_SYMBOLS, DEFAULT_CURRENCY } from '../../constants/constants';

export enum AddonCardPlace {
  SetCard,
  SetEditing,
}

export interface ToggleAddon {
  addon: Addon | Delivery;
  selected: boolean
}
@Component({
  selector: 'addon-card',
  imports: [StackComponent, CardComponent, RowComponent, CheckboxComponent, PriceStringPipe],
  templateUrl: './addon-card.component.html',
  styleUrl: './addon-card.component.scss'
})
export class AddonCardComponent {

  @Input() usage: AddonCardPlace = AddonCardPlace.SetCard;
  AddonCardPlace = AddonCardPlace;
  @Input() addon!: Addon | Delivery
  @Input() disabled = true;
  @Input() value = false;
  currency = input(DEFAULT_CURRENCY);
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  addonPrice = computed(() => this.addon.price[this.currency()])

  @Output() toggleAddon = new EventEmitter<ToggleAddon>();

  constructor(private stateService: StateService) {}

  changeAddonSelect() {
    this.value = !this.value;
    this.toggleAddon.emit( {addon: this.addon, selected: this.value})
  }

  get titleMeasure() {
    const weight = this.addon.type === ProductType.SetAddon ? this.addon.weight : 0;
    return weight > 0 ? `(${weight} кг)` : '';
  }

}
