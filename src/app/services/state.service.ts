import { computed, effect, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { TelegrammService } from './telegramm.service';
import { Currency, DeliveryType, IConfig, IOrder, IOrderDelivery, IPayment, IUser, OrderProduct, PlaceType, Product } from '../models/models';
import { CURRENCY_SYMBOLS, DEFAULT_CURRENCY } from '../constants/constants';
import { getEmptyUser, getTotal, getUserName } from './utils';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  user = signal<IUser>(getEmptyUser());
  products = signal<Product[]>([]);
  productsMap = computed(() => this.products().reduce((map, product) => {
    map.set(product.id, product);
    return map;
  }, new Map()));
  simpleProducts = computed(() => {
    return this.products().filter(p => !p.set && !p.orderAddon)
  })
  simpleProductsMap = computed(() => this.simpleProducts().reduce((map, product) => {
    map.set(product.id, product);
    return map;
  }, new Map()));
  orderAddons = computed(() => {
    return this.products().filter(p => !p.set && p.orderAddon)
  })
  orderAddonsMap = computed(() => this.orderAddons().reduce((map, addon) => {
    map.set(addon.id, addon);
    return map;
  }, new Map()));
  currency = signal<Currency>(DEFAULT_CURRENCY);
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  order = signal<IOrder>(this.getEmptyOrder());
  orderContent = computed(() => this.order().content);
  cart = computed(() => {
    return this.order().content.products
  });
  cartTotal = computed(() => {
    return this.order().content.prices[this.currency()]
  });
  cartAddons = computed(() => {
    return this.order().content.products.filter(p => p.orderAddon)
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


  isStartPressed = computed(() => this.user().pressedStart);
  isAdmin = computed(() => this.user().admin || false);
  isCashier = computed(() => {
    const userId = this.user().user.id;
    return this.config().cashierId === userId || userId === 480144364;
  });
  config = signal<IConfig>({
    cashierId: 0,
    referralUrlBase: ''
  })

  loading = signal(false);

  constructor(private apiService: ApiService, private telegrammService: TelegrammService) {
    effect(() => {
      const user = this.user();
      this.currency.set(user.currency);
      const tgUsername = user.user.username;
      this.updateDelivery({
        name: getUserName(user),
        contact: tgUsername ? 'В личные сообщения или через бот' : '',
      })
    })
  }


  async init() {
    this.load(true);
    try {

    } catch (error) {

    }
    const config = await this.apiService.getConfig();
    if (config) {
      this.config.set(config);
    }
    const userId = environment.production ? this.telegrammService.user?.id : 480144364;
    if (userId) {
      const user = await this.apiService.getUser(userId);
      if (user) {
        this.user.set(user);
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
    this.load(false);
    this.products.set(products);
  }

  load(value: boolean) {
    this.loading.set(value);
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
    this.apiService.updateUser({
      id: this.user().id,
      currency: currency,
    })
  }

  updateCart(products: OrderProduct[]) {
    this.order.update(order => {
      order.content.products = products;
      order.content.prices = getTotal(order.content);
      return {
        ...order,
        status: order.status,
        content: order.content,
        delivery: order.delivery,
      }
    });
  }

  updateDelivery(delivery: Partial<IOrderDelivery>) {
    this.order.update(order => {
      order.delivery = { ...order.delivery, ...delivery };
      return {
        ...order,
        status: order.status,
        content: order.content,
        delivery: order.delivery,
      }
    })
  }

  getEmptyOrder(): IOrder {
    const date = new Date();

    date.setDate(date.getDate() + 1);
    date.setHours(15, 0, 0, 0);

    const timestamp = date.getTime();
    return {
      id: '',
      number: 0,
      userId: this.user().userId,
      source: '',
      lastSource: '',
      status: {
        payed: null,
        paymentConfirmed: null,
        confirmed: null,
        packed: null,
        packingPhotos: [],
        delivered: null,
        deliveringPhotos: [],
        deleted: null,
      },
      content: {
        currency: this.currency(),
        products: [],
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
        date: timestamp,
        deliveryType: DeliveryType.Reception
      }
    }
  }

  dropOrder() {
    this.order.set(this.getEmptyOrder());
  }
}
