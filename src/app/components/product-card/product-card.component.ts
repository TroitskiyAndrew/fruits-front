import { Component, Input, Output, EventEmitter, OnInit, computed, input, HostListener } from '@angular/core'
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

export enum ProductUsage {
  Editing,
  Browsing
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
    GridComponent
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() usage: ProductUsage = ProductUsage.Browsing;
  ProductUsage = ProductUsage;
  @Input() currency: Currency = Currency.Rub;
  Currency = Currency;
  product = input<Product | undefined>();
  p_id = computed(() => {
    return this.product()?.name || crypto.randomUUID();
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
  p_fixedPrice = computed(() => {
    const product = this.product();
    return product?.set ? product.fixedPrice : false;
  })

  get price() {
    switch (this.usage) {
      case ProductUsage.Editing:
        return this.form().controls.price.controls[this.currency].getRawValue()
        break;
      default:
        return this.p_price()[this.currency]
        break;
    }

  }

  get weight() {
    const product = this.product();
    if (product && !product.set) {
      return product.weight;
    } else {
      const products = this.form().getRawValue().products;
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
  @Output() compactClick = new EventEmitter();

  form = computed<FormGroup<ControlsOf<ProductForm>>>(() => {
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
      fixedPrice: new FormControl(this.p_fixedPrice(), { nonNullable: true }),
      set: new FormControl(p?.set ?? false, { nonNullable: true }),
      products: productsControls
    })

  })
  editing = false;
  browsing = false;

  compactView = true;

  measureOptions = [
    { label: 'шт', value: Measure.Item },
    { label: 'кг', value: Measure.KG }
  ]

  typeOptions = [
    { label: 'Продукт', value: false },
    { label: 'Набор', value: true }
  ]

  priceOptions = [
    { label: 'Фиксированная цена', value: true },
    { label: 'Минимальная цена', value: false },
  ]

  @HostListener('click', [])
  onHostClick() {
    if (this.compactView && this.usage === ProductUsage.Browsing) {
      this.compactView = false;
      this.compactClick.emit();
    }
  }

  constructor(private fb: FormBuilder, private stateService: StateService, private apiService: ApiService) { }

  get isSet() {
    return this.form().value.set
  }

  get productsForm(): FormGroup {
    return this.form().get('products') as FormGroup
  }
  get pricesForm(): FormGroup {
    return this.form().get('price') as FormGroup
  }

  get defaultsWeight(): number {
    const obj = (this.form().get('products') as FormGroup).getRawValue() as Record<string, number>;
    return Object.entries(obj).reduce((acc: number, [id, count]: [string, number]) => {
      const product = this.simpleProductsMap().get(id)
      acc += (product?.weight || 0) * count;
      return acc;
    }, 0);
  }

  startEdit() {
    this.editing = true;
    this.compactView = false;
  }

  onCancel() {
    this.editing = false;
    this.compactView = true;
    this.cancel.emit()
  }

  async saveProduct() {
    const v = this.form().getRawValue()
    let result: Product = {
      id: this.p_id(),
      name: v.name,
      description: v.description,
      measure: v.measure,
      amount: Number(v.amount),
      weight: Number(v.weight),
      deleted: false,
      price: v.price as Record<Currency, number>,
      set: false
    }
    if (v.set) {
      const defaults: ISetProducts = {}
      Object.entries(v.products || {}).forEach(([id, count]: any) => {

        const product = this.simpleProductsMap().get(id)

        if (product && count > 0) {
          defaults[id] = {
            ...product,
            count
          }
        }

      })


      result = {
        ...result,
        set: true,
        fixedPrice: v.fixedPrice || false,
        products: defaults,
        weight: this.defaultsWeight,
      }

    }

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
  }
  async addToCart() {
    const v = this.form().getRawValue()
    let result: Product = {
      id: this.p_id(),
      name: v.name,
      description: v.description,
      measure: v.measure,
      amount: Number(v.amount),
      weight: Number(v.weight),
      deleted: false,
      price: v.price as Record<Currency, number>,
      set: false
    }
    if (v.set) {
      const defaults: ISetProducts = {}
      Object.entries(v.products || {}).forEach(([id, count]: any) => {

        const product = this.simpleProductsMap().get(id)

        if (product && count > 0) {
          defaults[id] = {
            ...product,
            count
          }
        }

      })


      result = {
        ...result,
        set: true,
        fixedPrice: v.fixedPrice || false,
        products: defaults,
        weight: this.defaultsWeight,
      }

    }

    this.accept.emit(result)

    this.editing = false;
  }

}
