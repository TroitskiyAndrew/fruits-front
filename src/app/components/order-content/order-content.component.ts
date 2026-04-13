import { Component, computed, effect, EventEmitter, Input, input, Output, signal } from '@angular/core';
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { ProductCardComponent, ProductCardPlace } from "../product-card/product-card.component";
import { CURRENCY_OPTIONS, CURRENCY_SYMBOLS } from '../../constants/constants';
import { ControlsOf, Currency, IOrderContent, IPrices,  ISetProducts,  OrderProduct, Product, ProductForm, ProductType } from '../../models/models';
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getTotal } from '../../services/utils';
import { CheckboxComponent } from "../../ui/checkbox/checkbox.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { RowComponent } from "../../ui/row/row.component";
import { AddonCardComponent, AddonCardPlace } from "../addon-card/addon-card.component";

export enum OrderContentPlace {
  CartPage,
  OrderPage,
}

@Component({
  selector: 'order-content',
  imports: [ReactiveFormsModule, StackComponent, ProductCardComponent, AddonCardComponent],
  templateUrl: './order-content.component.html',
  styleUrl: './order-content.component.scss'
})
export class OrderContentComponent {

  @Input() content!: IOrderContent;
  @Input() usage: OrderContentPlace = OrderContentPlace.CartPage;
  @Output() updateContent = new EventEmitter<IOrderContent>();
  OrderContentPlace = OrderContentPlace;
  AddonCardPlace = AddonCardPlace;
  _currency = input(Currency.VND);
  currency = signal(Currency.VND)
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  ProductCardPlace = ProductCardPlace;
  orderAddons = computed(() => this.stateService.orderAddons());
  orderAddonsMap = computed(() => this.stateService.orderAddonsMap());

  deliveryOptions = [
    { label: 'Обычная доставка', value: false },
    { label: 'Экспресс доставка', value: true }
  ]

  get products() {
    return this.content.products.filter(p => [ProductType.Set, ProductType.SimpleProduct].includes(p.type))
  }

  get productCardUsage () {
    return this.usage === OrderContentPlace.CartPage ? ProductCardPlace.Cart : ProductCardPlace.OrderPage
  }
  constructor(public stateService: StateService) {
    effect(() => this.currency.set(this._currency()));
  }

  calculateTotal() {
    this.content.prices = getTotal(this.content);
    this.updateContent.emit(this.content);
  }

  changeContent(product: Product, index: number) {
    this.content.products[index] = { ...product, count: 1 };
    this.calculateTotal()
  }
  deleteContent(index: number) {
    this.content.products = this.content.products.filter((_, i) => i !== index);
    this.calculateTotal()
  }

  selectAddon(id: string){
      const addonIds = this.content.products.filter(p => p.type === ProductType.OrderAddon).map(a => a.id);
      if (addonIds.includes(id)){
        this.content.products = this.content.products.filter(p => p.id !== id)
      } else {
        this.content.products = [...this.content.products, this.orderAddonsMap().get(id)]
      }
      this.calculateTotal()
  }

}
