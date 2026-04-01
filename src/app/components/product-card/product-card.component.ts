import { Component, Input, Output, EventEmitter, OnInit, computed, input, HostListener, effect, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { ControlsOf, Currency, ISet, ISetProducts, ISimpleProduct, Measure, Product, ProductForm } from '../../models/models'

import { CardComponent } from '../../ui/card/card.component'
import { StackComponent } from '../../ui/stack/stack.component'
import { RowComponent } from '../../ui/row/row.component'
import { ButtonComponent } from '../../ui/button/button.component'
import { InputComponent } from '../../ui/input/input.component'
import { SelectComponent } from '../../ui/select/select.component'
import { CounterComponent } from '../../ui/counter/counter.component'
import { TogglerComponent } from '../../ui/toggler/toggler.component'
import { StateService } from '../../services/state.service'
import { ApiService } from '../../services/api.service'
import { GridComponent } from "../../ui/grid/grid.component";
import { PriceStringPipe } from '../../pipes/price-string.pipe'
import { toSignal } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { CheckboxComponent } from "../../ui/checkbox/checkbox.component";
import { LoaderDirective } from '../../ui/loader/loader.directive'
import { CURRENCY_SYMBOLS } from '../../constants/constants'

export enum ProductCardPlace {
  AllProducts,
  Shop,
  Cart,
  OrderPage
}

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    StackComponent,
    RowComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CounterComponent,
    TogglerComponent,
    GridComponent,
    PriceStringPipe,
    CheckboxComponent,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() usage: ProductCardPlace = ProductCardPlace.Shop;
  ProductCardPlace = ProductCardPlace;
  _currency = input(Currency.VND);
  currency = signal(Currency.VND);
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  Currency = Currency;
  @Input() isExpanded = false;
  product = input<Product | undefined>();
  @Input() cartIndex: number = 0;

  get name() {
    return this.form.controls.name.value;
  }
  get description() {
    return this.form.controls.description.value;
  }
  get set() {
    return this.form.controls.set.value
  }
  get orderAddon() {
    return this.form.controls.orderAddon.value
  }
  get amount() {
    return this.form.controls.amount.value
  }
  get measure() {
    return this.form.controls.measure.value
  }
  get prices() {
    let productPrice = this.form.controls.price.getRawValue();
    if (!this.set || this.usage === ProductCardPlace.AllProducts) {
      return productPrice
    }
    const product = this.product();
    if (product?.set) {
      if (!product.fixedSet) {
        productPrice[Currency.Rub] = 0;
        productPrice[Currency.VND] = 0;
        productPrice[Currency.USDT] = 0;
      }
      const products = product.products;
      const productsFromForm = this.form.controls.products.getRawValue() as Record<string, number>;
      Object.entries(productsFromForm).forEach(([id, count]: [string, number]) => {
        const product = this.stateService.simpleProductsMap().get(id);
        productPrice[Currency.Rub] += (product?.price[Currency.Rub] || 0) * (count - (products[id]?.fixedCount || 0));
        productPrice[Currency.VND] += (product?.price[Currency.VND] || 0) * (count - (products[id]?.fixedCount || 0));
        productPrice[Currency.USDT] += (product?.price[Currency.USDT] || 0) * (count - (products[id]?.fixedCount || 0));
      }, 0);
    }
    return productPrice;
  }
  get price() {
    return this.prices[this.currency()];
  }
  get productPrices() {
    return this.product()?.price || {
      rub: 0,
      vnd: 0,
      usdt: 0,
    }
  }
  get productPrice() {
    return this.productPrices[this.currency()];
  }

  get priceRUB() {
    return this.prices[Currency.Rub];
  }
  get priceVND() {
    return this.prices[Currency.VND];
  }
  get priceUSDT() {
    return this.prices[Currency.USDT];
  }
  get deleted() {
    return this.form.controls.deleted.value
  }
  get fixedSet() {
    return this.form.controls.fixedSet.value
  }
  get products() {
    return this.form.controls.products.getRawValue()
  }
  get productsArray() {
    const products = this.products as Record<string, number>;
    const simpleProductsMap = this.stateService.simpleProductsMap();
    return Array(...Object.entries(products)).filter(([_, count]) => count > 0).map(([id]) => simpleProductsMap.get(id)!)
  }

  get weight() {
    const products = this.productsForm.getRawValue() as Record<string, number>;
    const product = this.product();
    if (product && !product.set) {
      return product.weight;
    } else {
      return Object.entries(products).reduce((acc: number, [id, count]: [string, number]) => {
        const product = this.stateService.simpleProductsMap().get(id)
        acc += (product?.weight || 0) * count;
        return acc;
      }, 0);
    }
  }

  get titleMeasure() {
    if (this.orderAddon) {
      return ''
    } else {
      if (this.set) {
        return `(${this.weight} кг)`
      } else {
        return `(${this.amount} ${this.measure})`
      }
    }
  }

  simpleProducts = computed(() => {
    return this.stateService.simpleProducts()
  })


  @Output() accept = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter();
  @Output() expand = new EventEmitter();
  @Output() changeContent = new EventEmitter<ISet>();
  @Output() deleteContent = new EventEmitter<number>();


  form = new FormGroup<ControlsOf<ProductForm>>({
    id: new FormControl('', { nonNullable: true }),
    deleted: new FormControl(false, { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    measure: new FormControl(Measure.KG, { nonNullable: true }),
    weight: new FormControl(0, { nonNullable: true }),
    amount: new FormControl(0, { nonNullable: true }),
    price: new FormGroup<ControlsOf<Record<Currency, number>>>({
      rub: new FormControl(0, { nonNullable: true }),
      vnd: new FormControl(0, { nonNullable: true }),
      usdt: new FormControl(0, { nonNullable: true }),
    }),
    fixedSet: new FormControl(false, { nonNullable: true }),
    set: new FormControl(false, { nonNullable: true }),
    products: new FormGroup<ControlsOf<Record<string, number>>>({}),
    orderAddon: new FormControl(false, { nonNullable: true }),
  });

  get productsForm(): FormGroup {
    return this.form.controls.products as FormGroup
  }

  get pricesForm(): FormGroup {
    return this.form.controls.price as FormGroup
  }

  editing = false;


  measureOptions = [
    { label: 'шт', value: Measure.Item },
    { label: 'кг', value: Measure.KG }
  ]

  typeOptions = [
    { label: 'Продукт', value: false },
    { label: 'Набор', value: true }
  ]

  priceOptions = [
    { label: 'Готовый набор', value: true },
    { label: 'Минимальная сумма', value: false },
  ]

  get showCardTitle() {
    return !this.isExpanded || this.usage !== ProductCardPlace.AllProducts
  }

  get showSetProducts() {
    if (!this.set) {
      return false;
    }
    if (this.usage === ProductCardPlace.AllProducts) {
      return this.fixedSet;
    } else {
      return true;
    }
  }

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router) {
    effect(() => {
      const product = this.product();
      if (!product) {
        this.editing = true;
      } else {
        this.patchForm(product)
      }
    });
    effect(() => this.currency.set(this._currency()));
  }

  patchForm(product: Product) {
    this.form.patchValue({ ...product, products: {} }, { emitEvent: false });
    const productsGroup = this.productsForm;
    Object.keys(productsGroup.controls).forEach(key => {
      productsGroup.removeControl(key);
    });
    if (product.set) {
      this.simpleProducts().forEach(prod => {
        this.form.controls.products.addControl(
          prod.id,
          new FormControl(
            product.products?.[prod.id]?.count ?? 0,
            { nonNullable: true }
          )
        )
      })
    }
  }

  startEdit() {
    this.editing = true;
    this.isExpanded = true;
  }

  deleteFromContent() {
    this.deleteContent.emit(this.cartIndex)
  }

  onCancel() {
    const product = this.product();
    if (product) {
      this.patchForm(product);
    }
    this.editing = false;
    this.isExpanded = false;
    this.cancel.emit()
  }

  onExpand() {
    if (this.usage === ProductCardPlace.AllProducts) {
      return;
    }
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.expand.emit();
    } else if (this.usage === ProductCardPlace.Cart || this.usage === ProductCardPlace.OrderPage) {
      this.isExpanded = false;
    }
  }

  getProductFromForm(): Product {
    const v = this.form.getRawValue()
    let result = v as ProductForm;

    for (const currency of Object.keys(result.price)) {
      const curr = currency as Currency;
      result.price[curr] = Number(result.price[curr])
    }
    if (result.set) {
      const products: ISetProducts = {}
      Object.entries(this.productsForm.getRawValue() as Record<string, number>).forEach(([id, count]: [string, number]) => {

        const product = this.stateService.simpleProductsMap().get(id)

        if (product && count > 0) {
          products[id] = {
            ...product,
            count
          }
          if (v.fixedSet) {
            products[id].fixedCount = count;
          }
        }

      })


      result = {
        ...result,
        weight: this.weight,
      }

      const product: Product = {
        ...result,
        weight: this.weight,
        products
      }

      return product;

    } else {
      const { products, fixedSet, ...base } = result;
      return { ...base, set: false, amount: base.orderAddon ? 1 : base.amount } as Product;
    }
  }

  async saveProduct() {
    const result = this.getProductFromForm()

    this.accept.emit(result)

    this.stateService.load(true);
    if (!this.product()) {
      try {
        const newProduct = await this.apiService.createProduct(result);
        if (newProduct) {
          const allProducts = this.stateService.products();
          this.stateService.products.set([...allProducts, newProduct])
        }
      } catch (error) {

      }
    } else {
      try {
        const updatedProduct = await this.apiService.updateProduct(result);
        if (updatedProduct) {
          const allProducts = this.stateService.products();
          for (let index = 0; index < allProducts.length; index++) {
            const element = allProducts[index];
            if (element.id === updatedProduct.id) {
              allProducts[index] = updatedProduct;
            }

          }
          this.stateService.products.set([...allProducts])
        }
      } catch (error) {

      }
    }
    this.stateService.load(false);
    this.editing = false;
    this.isExpanded = false;
  }
  addToCart() {
    const result = this.getProductFromForm() as ISet;
    this.accept.emit(result);
    this.stateService.updateCart([...this.stateService.cart(), { ...result, count: 1 }])

    this.isExpanded = false
  }

  buy() {
    this.addToCart();
    this.router.navigate(['cart']);
  }
  changeProducts() {
    if (this.usage === ProductCardPlace.Cart) {
      const product = this.getProductFromForm() as ISet
      this.changeContent.emit(product);
    }
  }

}
