import { Component, Input, Output, EventEmitter, OnInit, computed, input, HostListener, effect, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { ControlsOf, Currency, IPrices, Set, ISetProducts, SimpleProduct, Measure, Product, ProductForm, ProductType, SetType, DefaultAddonBy, Delivery, Addon } from '../../models/models'

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
import { AddonCardComponent, AddonCardPlace, ToggleAddon } from "../addon-card/addon-card.component";
import { ExpandableComponent } from "../../ui/expandable/expandable.component";

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
    AddonCardComponent,
    ExpandableComponent
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
  Measure = Measure;
  AddonCardPlace = AddonCardPlace;

  get name() {
    return this.form.controls.name.value;
  }
  get description() {
    return this.form.controls.description.value;
  }
  get isSet() {
    return this.form.controls.type.value === ProductType.Set
  }
  get isOrderAddon() {
    return this.form.controls.type.value === ProductType.OrderAddon
  }
  get isSetAddon() {
    return this.form.controls.type.value === ProductType.SetAddon
  }
  get isDelivery() {
    return this.form.controls.type.value === ProductType.Delivery
  }
  get isSimpleProduct() {
    return this.form.controls.type.value === ProductType.SimpleProduct
  }
  get isDefault() {
    return this.form.controls.default.value
  }
  get amount() {
    return this.form.controls.amount.value
  }
  get measure() {
    return this.form.controls.measure.value
  }
  get prices() {
    let productPrice = this.form.controls.price.getRawValue();
    if (!this.isSet || this.usage === ProductCardPlace.AllProducts) {
      return productPrice
    }
    const product = this.product();
    if (product?.type === ProductType.Set) {
      if (product.setType !== SetType.Fixed) {
        productPrice[Currency.Rub] = 0;
        productPrice[Currency.VND] = 0;
        productPrice[Currency.USDT] = 0;
      }
      const products = product.products;
      const productsFromForm = this.productsForm.getRawValue() as Record<string, number>;
      Object.entries(productsFromForm).forEach(([id, count]: [string, number]) => {
        const product = this.stateService.simpleProductsMap().get(id) || this.stateService.setAddonsMap().get(id);
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
  get isFixedSet() {
    return this.form.controls.setType.value === SetType.Fixed
  }
  get products() {
    return this.productsForm.getRawValue()
  }
  get productsArray() {
    const products = this.products as Record<string, number>;
    const simpleProductsMap = this.stateService.simpleProductsMap();
    const result = Array(...Object.entries(products)).filter(([id, count]) => count > 0 && simpleProductsMap.get(id)).map(([id, count]) => ({ ...simpleProductsMap.get(id), count }));
    return result;
  }

  get weight() {
    const products = this.productsForm.getRawValue() as Record<string, number>;
    const product = this.product();
    if (!product) {
      return 0;
    }
    switch (product.type) {
      case ProductType.SimpleProduct:
      case ProductType.SetAddon:
        return product.weight;
        break;
      case ProductType.Set:
        return Object.entries(products).reduce((acc: number, [id, count]: [string, number]) => {
          const product = this.stateService.simpleProductsMap().get(id) || this.stateService.setAddonsMap().get(id)
          acc += (product?.weight || 0) * count;
          return acc;
        }, 0);
        break;
      default:
        return 0;
    }
  }

  get titleMeasure() {
    switch (this.form.controls.type.value) {
      case ProductType.Set:
        return this.form.controls.setType.value === SetType.Fixed ? `(${this.weight} кг)` : '';
      case ProductType.SimpleProduct:
        return `(${this.amount} ${this.measure})`
      case ProductType.SetAddon:
        return this.weight > 0 ? `(${this.weight} кг)` : '';

      default:
        return ``
    }
  }

  simpleProducts = computed(() => {
    return this.stateService.simpleProducts()
  })

  setAddons = computed(() => this.stateService.setAddons());

  get availableSetAddons () {
    const product = this.product();
    const addons = this.stateService.setAddons()
    if(product?.type === ProductType.Set) {
      return addons.filter(addon => product.addons[addon.id] )
    }
    return addons
  };

  get currentSelectedAddons() {
    const product = this.getProductFromForm();
    switch (product.type) {
      case ProductType.Set:
        return Object.values(product.products).filter(p => p.type === ProductType.SetAddon && p.count > 0).map(p => p as Addon);
        break;

      default:
        return [];
        break;
    }
  };
  setAddonsMap = computed(() => this.stateService.setAddonsMap());
  addons = [];


  @Output() accept = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter();
  @Output() expand = new EventEmitter();
  @Output() changeContent = new EventEmitter<Product>();
  @Output() deleteContent = new EventEmitter<number>();


  form = new FormGroup<ControlsOf<ProductForm>>({
    id: new FormControl('', { nonNullable: true }),
    type: new FormControl(ProductType.SimpleProduct, { nonNullable: true }),
    name: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    deleted: new FormControl(false, { nonNullable: true }),

    weight: new FormControl(0, { nonNullable: true }),
    measure: new FormControl(Measure.KG, { nonNullable: true }),
    amount: new FormControl(0, { nonNullable: true }),
    setType: new FormControl(SetType.Fixed, { nonNullable: true }),
    products: new FormGroup<ControlsOf<Record<string, number>>>({}),
    addons: new FormGroup<ControlsOf<Record<string, number>>>({}),
    default: new FormControl(DefaultAddonBy.None, { nonNullable: true }),
    price: new FormGroup<ControlsOf<Record<Currency, number>>>({
      rub: new FormControl(0, { nonNullable: true }),
      vnd: new FormControl(0, { nonNullable: true }),
      usdt: new FormControl(0, { nonNullable: true }),
    }),
    minPrice: new FormGroup<ControlsOf<IPrices>>({
      rub: new FormControl(0, { nonNullable: true }),
      vnd: new FormControl(0, { nonNullable: true }),
      usdt: new FormControl(0, { nonNullable: true }),
    }),
    minCount: new FormControl(0, { nonNullable: true }),
  });

  get productsForm(): FormGroup {
    return this.form.controls.products as FormGroup
  }
  get addonsForm(): FormGroup {
    return this.form.controls.addons as FormGroup
  }

  get pricesForm(): FormGroup {
    return this.form.controls.price as FormGroup
  }
  get minPricesForm(): FormGroup {
    return this.form.controls.minPrice as FormGroup
  }

  get isFromMinPrice() {
    return this.form.controls.default.value === DefaultAddonBy.Price;
  }
  get isFromMinCount() {
    return this.form.controls.default.value === DefaultAddonBy.Count;
  }

  editing = false;


  get measureOptions() {
    const options = [
      { label: 'шт', value: Measure.Item },
      { label: 'кг', value: Measure.KG }
    ] as { label: string; value: Measure | '' }[];
    if (this.form.controls.type.value === ProductType.SetAddon) {
      options.push({ label: '', value: '' });
    }
    return options;
  }

  typeOptions = [
    { label: 'Продукт', value: ProductType.SimpleProduct },
    { label: 'Набор', value: ProductType.Set },
    { label: 'Доставка', value: ProductType.Delivery },
    { label: 'Апсейл', value: ProductType.SetAddon },
  ]

  addonDefaultOptions = [
    { label: 'Нет', value: DefaultAddonBy.None },
    { label: 'Авто', value: DefaultAddonBy.Unconditional },
    { label: 'От цены', value: DefaultAddonBy.Price },
    { label: 'От кол-ва', value: DefaultAddonBy.Count },
  ]

  setTypeOptions = [
    { label: 'Готовый набор', value: SetType.Fixed },
    { label: 'Минимальная сумма', value: SetType.MinPrice },
  ]

  get showCardTitle() {
    return !this.isExpanded || this.usage !== ProductCardPlace.AllProducts
  }
  blockSetProducts = false;
  get showSetProducts() {
    if (this.blockSetProducts) {
      return false
    }
    if (!this.isSet) {
      return false;
    }
    if (this.usage === ProductCardPlace.AllProducts) {
      return this.isFixedSet;
    } else {
      return true;
    }
  }

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router) {
    effect(() => {
      const addons = this.stateService.setAddons();
      const addonsForm = this.addonsForm;
      Object.keys(addonsForm.controls).forEach(key => {
        addonsForm.removeControl(key, { emitEvent: false });
      });
      [...addons].forEach(prod => {
        addonsForm.addControl(
          prod.id,
          new FormControl(
            false,
            { nonNullable: true }
          ), { emitEvent: false }
        )
      })

    });
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
    let minPrice;
    let minCount;
    if ([ProductType.Delivery, ProductType.OrderAddon, ProductType.SetAddon].includes(product.type)) {
      minPrice = (product as Delivery | Addon).minPrice || undefined;
      minCount = (product as Delivery | Addon).minCount || 100;
    }
    this.form.patchValue({ ...product, products: {}, minPrice, minCount }, { emitEvent: false });
    const productsGroup = this.productsForm;
    Object.keys(productsGroup.controls).forEach(key => {
      productsGroup.removeControl(key, { emitEvent: false });
    });
    [...this.simpleProducts(), ...this.setAddons()].forEach(prod => {
      this.form.controls.products.addControl(
        prod.id,
        new FormControl(
          (product as Set).products?.[prod.id]?.count ?? 0,
          { nonNullable: true }
        ), { emitEvent: false }
      )
    })
  }

  changeType(value: ProductType) {
    if (value === ProductType.Set) {
      this.blockSetProducts = true;
      const productsGroup = this.productsForm;
      Object.keys(productsGroup.controls).forEach(key => {
        productsGroup.removeControl(key, { emitEvent: false });
      });

      [...this.simpleProducts(), ...this.setAddons()].forEach(prod => {
        this.form.controls.products.addControl(
          prod.id,
          new FormControl(
            (this.product() as Set)?.products?.[prod.id]?.count ?? 0,
            { nonNullable: true }
          ), { emitEvent: false }
        )
      })
      this.blockSetProducts = false;
    }

  }

  startEdit() {
    this.editing = true;
    this.isExpanded = true;
  }

  deleteFromContent() {
    if (this.cartIndex === null) {
      return;
    }
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
    const formValue = this.form.getRawValue();
    const result: Product = {} as Product;
    for (const currency of Object.keys(formValue.price)) {
      const curr = currency as Currency;
      formValue.price[curr] = Number(formValue.price[curr])
      formValue.minPrice[curr] = Number(formValue.minPrice[curr])
    }
    // base
    result.id = formValue.id;
    result.type = formValue.type;
    result.name = formValue.name;
    result.description = formValue.description
    result.price = formValue.price as IPrices
    result.deleted = formValue.deleted

    switch (result.type) {
      case ProductType.Set: {
        const products: ISetProducts = {}
        Object.entries(this.productsForm.getRawValue() as Record<string, number>).forEach(([id, count]: [string, number]) => {

          const product = this.stateService.simpleProductsMap().get(id) || this.stateService.setAddonsMap().get(id)!

          if (product && count > 0) {
            products[id] = {
              ...product,
              count
            }
            if (formValue.setType === SetType.Fixed && product.type === ProductType.SimpleProduct) {
              products[id].fixedCount = count;
            }
          }

        })

        result.addons = formValue.addons
        result.weight = Number(formValue.weight);
        result.products = products;
        result.setType = formValue.setType;
        return result;

      }
      case ProductType.SimpleProduct: {

        result.weight = Number(formValue.weight);
        result.measure = formValue.measure;
        result.amount = Number(formValue.amount);
        return result
      }
      case ProductType.Delivery: {

        result.default = formValue.default;
        if (result.default === DefaultAddonBy.Price) {
          result.minPrice = formValue.minPrice as IPrices
          result.minCount = null;
        } else if (result.default === DefaultAddonBy.Count) {
          result.minCount = Number(formValue.minCount);
          result.minPrice = null;
        }
        return result
      }
      case ProductType.SetAddon:
      case ProductType.OrderAddon: {
        result.weight = Number(formValue.weight);
        result.amount = Number(formValue.amount);
        if (formValue.measure) {
          result.measure = formValue.measure;
        }
        result.default = formValue.default;
        if (result.default === DefaultAddonBy.Price) {
          result.minPrice = formValue.minPrice as IPrices
          result.minCount = null;
        } else if (result.default === DefaultAddonBy.Count) {
          result.minCount = Number(formValue.minCount);
          result.minPrice = null;
        }
        return result
      }
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
    const result = this.getProductFromForm();
    this.accept.emit(result);
    this.stateService.updateCart([...this.stateService.cart(), { ...result, count: 1 }])

    this.isExpanded = false
  }

  toggleAddon(options: ToggleAddon) {
    const { id } = options.addon;
    const current = this.productsForm.controls[id].value;
    this.productsForm.controls[id].setValue(current ? 0 : 1);
    if (this.usage === ProductCardPlace.Cart) {
      const result = this.getProductFromForm();
      const cart = this.stateService.cart();
      cart[this.cartIndex] = { ...result, count: 1 }
      this.stateService.updateCart([...cart])
    }
  }

  buy() {
    this.addToCart();
    this.router.navigate(['cart']);
  }
  changeProducts() {
    if (this.usage === ProductCardPlace.Cart) {
      const product = this.getProductFromForm()
      this.changeContent.emit(product);
    }
  }

  changeCounter(p: Product) {
    return this.usage === ProductCardPlace.Cart && ((this.price - p.price[this.currency()]) < this.productPrice)
  }

  toggleAddonInSet(id: string) {
    this.addonsForm.controls[id].setValue(!this.addonsForm.controls[id].value);
  }

}
