import { Component, computed, effect, Input, input, signal } from '@angular/core';
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { ProductCardComponent, ProductCardPlace } from "../product-card/product-card.component";
import { CURRENCY_OPTIONS, EXPRESS_DELIVERY } from '../../constants/constants';
import { Currency, IOrderContent, ISet, ISetProducts, ISimpleProduct, OrderProduct, Product } from '../../models/models';
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'order-content',
  imports: [ReactiveFormsModule, TogglerComponent, StackComponent, ProductCardComponent, PriceStringPipe],
  templateUrl: './order-content.component.html',
  styleUrl: './order-content.component.scss'
})
export class OrderContentComponent {

  @Input() content!: IOrderContent;
  trigger = signal(false)
  contentSignal = computed(() => {
    this.trigger();
    return this.content;
  })

  currencyOptions = CURRENCY_OPTIONS;
  ProductCardPlace = ProductCardPlace;

  currency = computed(() => this.stateService.currency());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  deliveryOptions = [
    { label: 'Обычная доставка', value: false },
    { label: 'Экспресс доставка', value: true }
  ]
  constructor(public stateService: StateService) {
    effect(() => {
      this.currency()
      this.calculateTotal()
    })
  }

  changeCurrency(currency: Currency) {
    this.stateService.changeCurrency(currency)
  }

  changeDelivery() {
    this.content.expressDelivery = !this.content.expressDelivery;
    this.calculateTotal();
  }

  calculateTotal() {
    const currency = this.currency();
    const productsTotal = this.content.products.reduce((acc, product) => {
      if (product.set && !product.fixedSet) {
        acc += Object.values(product.products).reduce((acc2: number, product: OrderProduct<ISimpleProduct>) => {
          acc2 += (product.price[currency] || 0) * product.count;
          return acc2;
        }, 0)
      } else {
        acc += product.price[currency];
      }
      return acc;
    }, 0);
    const delivery = this.content.expressDelivery ? EXPRESS_DELIVERY[currency] : 0;
    this.content.total = productsTotal + delivery;
    this.trigger.update(v => !v);
  }

  changeContent(product: ISet, index: number) {
    this.content.products[index]={...product, count: 1};
    this.calculateTotal()
  }
  deleteContent(index: number) {
    this.content.products = this.content.products.filter((_, i) => i !== index);
    this.calculateTotal()
  }

}
