import { Component, computed } from '@angular/core';
import { ButtonComponent } from "../../ui/button/button.component";
import { PageComponent } from "../../ui/page/page.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { ProductCardComponent, ProductCardPlace } from "../../components/product-card/product-card.component";
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { CURRENCY_OPTIONS } from '../../constants/constants';
import { Currency, IOrderContent } from '../../models/models';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderContentComponent } from "../../components/order-content/order-content.component";

@Component({
  selector: 'cart-page',
  imports: [ReactiveFormsModule, PageComponent, ButtonComponent, OrderContentComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {

  content = computed<IOrderContent>(() => ({
    total: this.stateService.cartTotal(),
    products: this.stateService.cart(),
    currency: this.stateService.currency(),
    expressDelivery: false,
  }))
  constructor(private stateService: StateService) {}
}
