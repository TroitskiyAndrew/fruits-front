import { computed, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { TelegrammService } from './telegramm.service';
import { Currency, DeliveryType, IOrder, IOrderDelivery, IPayment, OrderProduct, PlaceType, Product } from '../models/models';
import { CURRENCY_SYMBOLS, EXPRESS_DELIVERY } from '../constants/constants';
import { getTotal } from './utils';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  products = signal<Product[]>([]);
  productsMap = computed(() => this.products().reduce((map, product) => {
    map.set(product.id, product);
    return map;
  }, new Map()));
  currency = signal<Currency>(Currency.Rub);
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  expressDelivery = signal<boolean>(false);
  order = signal<IOrder>({
    id: '',
    number: 0,
    userId: 0,
    source: '',
    lastSource: '',
    state: {
      payed: false,
      confirmed: false,
      packed: false,
      delivered: false,
      deleted: false,
      sent: false,
    },
    content: {
      currency: this.currency(),
      products: [],
      expressDelivery: false,
      prices: {
        [Currency.Rub]: 0,
        [Currency.VND]: 0,
        [Currency.USDT]: 0,
      }
    },
    delivery: {
      name: '',
      contact: '',
      placeType: PlaceType.Hotel,
      place: '',
      placeAdd: '',
      date: '',
      deliveryType: DeliveryType.Reception
    }
  });
  paymentId = '';
  orderContent = computed(() => this.order().content);
  cart = computed(() => {
    return this.order().content.products
  });
  cartTotal = computed(() => {
    return this.order().content.prices[this.currency()]
  });
  orderDelivery = computed(() => this.order().delivery);
  orders = signal<IOrder[]>([]);
  ordersMap = computed(() => this.orders().reduce((map: Map<string, IOrder>, order: IOrder) => {
    map.set(order.id, order);
    return map;
  }, new Map()))
  payments = signal<IPayment[]>([]);
  paymentsMap = computed(() => this.payments().reduce((map: Map<string, IPayment>, payment: IPayment) => {
    map.set(payment.id, payment);
    return map;
  }, new Map()));



  queryParams: Record<string, any> = {};
  discountEvent = '';
  source = '';
  target = '';

  sessionId = this.generateSecureId();

  user = signal<any>({ userId: 480144364, pressedStart: true, admin: true });
  isStartPressed = computed(() => this.user().pressedStart);
  isAdmin = computed(() => this.user().admin || false);

  constructor(private apiService: ApiService, private telegrammService: TelegrammService) { }


  async init() {
    if (this.telegrammService.initData) {
      const user = await this.apiService.getUser(this.telegrammService.user?.id || 0);
      this.user.set(user || {});
      if (user) {
        this.order.update(order => {
          order.userId = user.userId;
          order.source = user.source;
          order.lastSource = user.sources[user.sources.length - 1];
          if (user.referral) {
            order.referral = user.referral;
          }
          return order;
        })
      }
    }
    const products = await this.apiService.getAllProducts();
    console.log('products', products)
    this.products.set(products);
  }
  generateSecureId(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    return Array.from(array)
      .map(x => chars[x % chars.length])
      .join('');
  }

  changeCurrency(currency: Currency) {
    this.currency.set(currency);
  }
  updateCart(products: OrderProduct[]) {
    this.order.update(order => {
      order.content.products = products;
      order.content.prices = getTotal(order.content);
      return {
        ...order,
        state: order.state,
        content: order.content,
        delivery: order.delivery,
      }
    });
  }
  updateDelivery(delivery: IOrderDelivery) {
    this.order.update(order => {
      order.delivery = delivery;
      return {
        ...order,
        state: order.state,
        content: order.content,
        delivery: order.delivery,
      }
    })
  }
}
