import { Component, computed } from '@angular/core';
import { ButtonComponent } from "../../ui/button/button.component";
import { PageComponent } from "../../ui/page/page.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { ProductCardComponent, ProductCardPlace } from "../../components/product-card/product-card.component";
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { CURRENCY_OPTIONS } from '../../constants/constants';
import { Currency } from '../../models/models';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart-page',
  imports: [ReactiveFormsModule, PageComponent, TogglerComponent, StackComponent, ProductCardComponent, PriceStringPipe, TogglerComponent, ButtonComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {
  currencyOptions = CURRENCY_OPTIONS;
  ProductCardPlace = ProductCardPlace;
  cartTotal = computed(() => this.stateService.cartTotal());
  currency = computed(() => this.stateService.currency());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  cart = computed(() => this.stateService.cart());
  deliveryOptions = [
    { label: 'Обычная доставка', value: false },
    { label: 'Экспресс доставка', value: true }
  ]
  constructor(public stateService: StateService) { }

  changeCurrency(currency: Currency) {
    this.stateService.changeCurrency(currency)
  }

  changeDelivery(){
    this.stateService.expressDelivery.update(val => !val)
  }
}
