import { Component, Input, Output, EventEmitter, OnInit, computed, input, HostListener, effect } from '@angular/core'
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

export enum ProductCardPlace {
  AllProducts,
  Shop,
  Cart,
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
    PriceStringPipe
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() usage: ProductCardPlace = ProductCardPlace.Shop;
  ProductCardPlace = ProductCardPlace;
  currency = computed(() => this.stateService.currency());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  Currency = Currency;
  @Input() isExpanded = false;
  product = input<Product | undefined>();
  @Input() cartIndex: number = 0;
  p_id = computed(() => {
    return this.product()?.id || crypto.randomUUID();
  })
  p_name = computed(() => {
    return this.product()?.name || '';
  })
  p_description = computed(() => {
    return this.product()?.description || '';
  })
  p_set = computed(() => {
    return this.product()?.set || false;
  })
  p_weight = computed(() => {
    return this.product()?.weight || 0;
  })
  p_amount = computed(() => {
    return this.product()?.amount || 0;
  })
  p_measure = computed(() => {
    return this.product()?.measure || Measure.KG;
  })
  p_price = computed<Record<Currency, number>>(() => {
    return this.product()?.price || {
      rub: 0,
      vnd: 0,
      usdt: 0,
    };
  })
  p_dataBasePrice = computed<number>(() => {
    const product = this.product();
    const dataBaseProduct = product ? this.stateService.productsMap().get(product.id) : null
    const price = dataBaseProduct?.price || {
      rub: 0,
      vnd: 0,
      usdt: 0,
    };
    return price[this.currency()]
  })
  p_currency_price = computed<number>(() => {
    return this.p_price()[this.currency()];
  })
  p_priceRUB = computed(() => {
    return this.p_price().rub;
  })
  p_priceVND = computed(() => {
    return this.p_price().vnd;
  })
  p_priceUSDT = computed(() => {
    return this.p_price().usdt;
  })
  p_deleted = computed(() => {
    return this.product()?.deleted || false;
  })
  p_fixedSet = computed(() => {
    const product = this.product();
    return product?.set ? product.fixedSet : true;
  })
  p_products = computed(() => {
    const product = this.product();
    return product?.set ? product.products : {};
  })
  p_productsArray = computed(() => {
    const product = this.product();
    const obj = product?.set ? product.products : {};
    return Array(...Object.values(obj))
  })

  get price() {
    return this.productPrice[this.currency()];
  }
  get productPrice() {
    switch (this.usage) {
      case ProductCardPlace.AllProducts:
        return this.form().controls.price.getRawValue()
      case ProductCardPlace.Shop:
      case ProductCardPlace.Cart:
        if (this.p_fixedSet()) {
          return this.p_price()
        } else {
          const productsValue = this.productsForm().getRawValue() as Record<string, number>;
          const prices = {
            [Currency.Rub]: 0,
            [Currency.VND]: 0,
            [Currency.USDT]: 0,
          }
          Object.entries(productsValue).forEach(([id, count]: [string, number]) => {
            const product = this.simpleProductsMap().get(id);
            prices[Currency.Rub] += (product?.price[Currency.Rub] || 0) * count;
            prices[Currency.VND] += (product?.price[Currency.VND] || 0) * count;
            prices[Currency.USDT] += (product?.price[Currency.USDT] || 0) * count;
          }, 0);
          return prices;
        }
      default:
        return this.p_price()
    }

  }

  get weight() {
    const products = this.productsForm().getRawValue();
    const product = this.product();
    if (product && !product.set) {
      return product.weight;
    } else {
      return Object.entries(products).reduce((acc: number, [id, count]: [string, number]) => {
        const product = this.simpleProductsMap().get(id)
        acc += (product?.weight || 0) * count;
        return acc;
      }, 0);
    }
  }

  simpleProducts = computed(() => {
    return this.stateService.products().filter(p => !p.set)
  })
  simpleProductsMap = computed<Map<string, ISimpleProduct>>(() => this.simpleProducts().reduce((map, product) => {
    map.set(product.id, product);
    return map;
  }, new Map()));

  @Output() accept = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter();
  @Output() expand = new EventEmitter();
  @Output() changeContent = new EventEmitter<ISet>();
  @Output() deleteContent = new EventEmitter<number>();

  form = computed<FormGroup<ControlsOf<ProductForm>>>(() => {
    const priceControls = new FormGroup<ControlsOf<Record<Currency, number>>>({
      rub: new FormControl(this.p_priceRUB(), { nonNullable: true }),
      vnd: new FormControl(this.p_priceVND(), { nonNullable: true }),
      usdt: new FormControl(this.p_priceUSDT(), { nonNullable: true }),
    })
    return new FormGroup<ControlsOf<ProductForm>>({
      id: new FormControl(this.p_id(), { nonNullable: true }),
      deleted: new FormControl(this.p_deleted(), { nonNullable: true }),
      name: new FormControl(this.p_name(), { nonNullable: true }),
      description: new FormControl(this.p_description(), { nonNullable: true }),
      measure: new FormControl(this.p_measure(), { nonNullable: true }),
      weight: new FormControl(this.p_weight(), { nonNullable: true }),
      amount: new FormControl(this.p_amount(), { nonNullable: true }),
      price: priceControls,
      fixedSet: new FormControl(this.p_fixedSet(), { nonNullable: true }),
      set: new FormControl(this.p_set(), { nonNullable: true }),
    })

  });
  productsForm = computed<FormGroup<ControlsOf<Record<string, number>>>>(() => {
    const p = this.product()

    const productsControls = new FormGroup<ControlsOf<Record<string, number>>>({})

    this.simpleProducts().forEach(prod => {
      productsControls.addControl(
        prod.id,
        new FormControl(
          p?.set ? p?.products?.[prod.id]?.count ?? 0 : 0,
          { nonNullable: true }
        )
      )
    })
    return productsControls

  });

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

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router) {
    effect(() => {
      const product = this.product();
      if (!product) {
        this.editing = true;
      }
    });
  }

  get isSet() {
    return this.form().value.set
  }
  get isFixedSet() {
    return this.form().value.fixedSet
  }

  get showSetProducts() {
    if (!this.isSet) {
      return false;
    }
    if (this.usage === ProductCardPlace.AllProducts) {
      return this.isFixedSet;
    } else {
      return true;
    }
  }

  get pricesForm(): FormGroup {
    return this.form().get('price') as FormGroup
  }

  get defaultsWeight(): number {
    const obj = this.productsForm().getRawValue() as Record<string, number>;
    return Object.entries(obj).reduce((acc: number, [id, count]: [string, number]) => {
      const product = this.simpleProductsMap().get(id)
      acc += (product?.weight || 0) * count;
      return acc;
    }, 0);
  }

  startEdit() {
    this.editing = true;
    this.isExpanded = true;
  }

  deleteFromContent() {
    this.deleteContent.emit(this.cartIndex)
  }

  onCancel() {
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
    } else if (this.usage === ProductCardPlace.Cart) {
      this.isExpanded = false;
    }
  }

  getProductFromForm() {
    const v = this.form().getRawValue()
    let result: Product = {
      id: this.p_id(),
      name: v.name,
      description: v.description,
      measure: v.measure,
      amount: Number(v.amount),
      weight: Number(v.weight),
      deleted: false,
      price: this.productPrice,
      set: false
    }
    if (v.set) {
      const products: ISetProducts = {}
      Object.entries(this.productsForm().getRawValue()).forEach(([id, count]: any) => {

        const product = this.simpleProductsMap().get(id)

        if (product && count > 0) {
          products[id] = {
            ...product,
            count
          }
        }

      })


      result = {
        ...result,
        set: true,
        fixedSet: v.fixedSet || false,
        products,
        weight: this.defaultsWeight,
      }

    }
    return result;
  }

  async saveProduct() {
    const result = this.getProductFromForm()

    this.accept.emit(result)


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
    this.editing = false;
    this.isExpanded = false;
  }
  async addToCart() {
    const result = this.getProductFromForm() as ISet;
    this.accept.emit(result);
    this.stateService.cart.update(products => [...products, { ...result, count: 1 }])

    this.isExpanded = false
  }

  buy() {
    this.addToCart();
    this.router.navigate(['cart']);
  }
  changeProducts() {
    if (this.usage === ProductCardPlace.Cart) {
      const product = this.getProductFromForm()  as ISet
      this.changeContent.emit(product);
    }
  }

}
