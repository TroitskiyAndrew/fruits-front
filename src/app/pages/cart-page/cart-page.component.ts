import { Component, computed, effect } from '@angular/core';
import { ButtonComponent } from "../../ui/button/button.component";
import { PageComponent } from "../../ui/page/page.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { ProductCardComponent, ProductCardPlace } from "../../components/product-card/product-card.component";
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { CURRENCY_OPTIONS } from '../../constants/constants';
import { Currency, IOrderContent, IOrderDelivery } from '../../models/models';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderContentComponent, OrderContentPlace } from "../../components/order-content/order-content.component";
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { OrderDeliveryComponent, OrderDeliveryPlace } from "../../components/order-delivery/order-delivery.component";
import { TelegrammService } from '../../services/telegramm.service';
import { environment } from '../../../environments/environment';
import { CardComponent } from "../../ui/card/card.component";

@Component({
  selector: 'cart-page',
  imports: [ReactiveFormsModule, PageComponent, ButtonComponent, OrderContentComponent, PriceStringPipe, OrderDeliveryComponent, CardComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent {

  content = computed<IOrderContent>(() => this.stateService.orderContent())
  delivery = computed<IOrderDelivery>(() => this.stateService.orderDelivery())
  total = computed(() => this.stateService.cartTotal())
  currency = computed(() => this.stateService.currency());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  currencyOptions = CURRENCY_OPTIONS;
  OrderContentPlace = OrderContentPlace;
  OrderDeliveryPlace = OrderDeliveryPlace;

  canCreateOrder = false;
  showDelivery = false;


  constructor(private stateService: StateService, private telegrammService: TelegrammService , private router: Router) {
    if(this.stateService.cart().length === 0){
      this.router.navigate([''])
    }
    effect(() => {
      if(this.stateService.cart().length === 0) {
        this.router.navigate([''])
      }
    })
    if (this.telegrammService.initData || !environment.production){
      this.showDelivery = true;
    }
  }

  updateCart(content: IOrderContent) {
    this.stateService.updateCart(content.products)
  }

  changeCurrency(currency: Currency) {
    this.stateService.changeCurrency(currency)
  }
  submitDeliveryValue(delivery: IOrderDelivery | null){
      if(delivery) {
        this.stateService.updateDelivery(delivery);
        this.canCreateOrder = true;
      } else {
        this.canCreateOrder = false
      }
    }
}
