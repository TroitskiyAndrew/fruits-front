import { computed, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { TelegrammService } from './telegramm.service';
import { Currency, Product } from '../models/models';
import { CURRENCY_SYMBOLS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  products = signal<Product[]>([]);
  cart = signal<Product[]>([]);
  currency = signal<Currency>(Currency.Rub);
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()])
  cartTotal = computed(() => {
    return this.cart().reduce((acc, product) => acc += product.price[this.currency()], 0)
  })
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
}
