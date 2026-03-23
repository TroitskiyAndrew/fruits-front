import { Component, computed, effect, EventEmitter, Input, input, Output, signal } from '@angular/core';
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { ProductCardComponent, ProductCardPlace } from "../product-card/product-card.component";
import { CURRENCY_OPTIONS, EXPRESS_DELIVERY } from '../../constants/constants';
import { Currency, IOrderContent, ISet, ISetProducts, ISimpleProduct, OrderProduct, Product } from '../../models/models';
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { getTotal } from '../../services/utils';

@Component({
  selector: 'order-content',
  imports: [ReactiveFormsModule, TogglerComponent, StackComponent, ProductCardComponent],
  templateUrl: './order-content.component.html',
  styleUrl: './order-content.component.scss'
})
export class OrderContentComponent {

  @Input() content!: IOrderContent;
  @Output() updateContent = new EventEmitter<IOrderContent>();

  currencyOptions = CURRENCY_OPTIONS;
  ProductCardPlace = ProductCardPlace;


  deliveryOptions = [
    { label: 'Обычная доставка', value: false },
    { label: 'Экспресс доставка', value: true }
  ]
  constructor(public stateService: StateService) {
    effect(() => {
      this.calculateTotal()
    })
  }

  changeDelivery() {
    this.content.expressDelivery = !this.content.expressDelivery;
    this.calculateTotal();
  }

  calculateTotal() {
    this.content.prices = getTotal(this.content);
    this.updateContent.emit(this.content);
  }

  changeContent(product: ISet, index: number) {
    this.content.products[index] = { ...product, count: 1 };
    this.calculateTotal()
  }
  deleteContent(index: number) {
    this.content.products = this.content.products.filter((_, i) => i !== index);
    this.calculateTotal()
  }

}
