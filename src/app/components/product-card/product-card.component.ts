import { Component, Input, Output, EventEmitter, OnInit, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { ISetProducts, ISimpleProduct, Measure, Product } from '../../models/models'

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
export class ProductCardComponent implements OnInit {

  @Input() product?: Product
  @Input() editable = false
  products = computed(() => {
    return this.stateService.products().filter(p => !p.set)
  })
  productsMap = computed<Map<string, ISimpleProduct>>(() => this.products().reduce((map, product) => {
    map.set(product.id, product);
    return map;
  }, new Map()));

  @Output() save = new EventEmitter<Product>()
  @Output() cancelEvent = new EventEmitter()

  form = computed(() => {
    const p = this.product as Product | undefined

    const defaults: Record<string, any> = {}
    const products = this.products();
    products.forEach(prod => {
        defaults[prod.id] = p?.set ? p?.defaultProducts?.[prod.id]?.count ?? 0 : 0
      })

    return this.fb.group({

      name: [this.product?.name ?? ''],
      description: [this.product?.description ?? ''],
      measure: [this.product?.measure ?? Measure.KG],
      weight: [this.product?.weight ?? 1],
      amount: [this.product?.amount ?? 1],

      priceRub: [this.product?.price?.rub ?? 0],
      priceVnd: [this.product?.price?.vnd ?? 0],
      priceUsdt: [this.product?.price?.usdt ?? 0],

      set: [this.product?.set ?? false],

      defaultProducts: this.fb.group(defaults)

    })
  })
  editing = false
  creating = false

  measureOptions = [
    { label: 'шт', value: Measure.Item },
    { label: 'кг', value: Measure.KG }
  ]

  typeOptions = [
    { label: 'Продукт', value: false },
    { label: 'Набор', value: true }
  ]

  constructor(private fb: FormBuilder, private stateService: StateService, private apiService: ApiService) { }

  ngOnInit(): void {

    if (!this.product) {
      this.editing = true;
      this.creating = true;
    }



  }

  get isSet() {
    return this.form().value.set
  }

  get defaultsForm(): FormGroup {
    return this.form().get('defaultProducts') as FormGroup
  }

  get defaultsWeight(): number {
    const obj = (this.form().get('defaultProducts') as FormGroup).getRawValue() as Record<string, number>;
    return Object.entries(obj).reduce((acc: number, entry) => {
      const product = this.productsMap().get(entry[0])
      acc += (product?.weight || 0) * entry[1];
      return acc;
    }, 0);
  }

  startEdit() {
    this.editing = true
  }

  cancel() {
    this.editing = false;
    this.cancelEvent.emit()
  }

  async saveProduct() {

    const v = this.form().value

    let result: Product = {
      id: this.product?.id ?? crypto.randomUUID(),
      name: v.name || '',
      description: v.description || '',
      measure: v.measure || Measure.KG,
      amount: Number(v.amount),
      weight: Number(v.weight),
      deleted: false,
      price: {
        rub: Number(v.priceRub),
        vnd: Number(v.priceVnd),
        usdt: Number(v.priceUsdt)
      },
      set: false
    }
    if (v.set) {
      const defaults: ISetProducts = {}
      Object.entries(v.defaultProducts || {}).forEach(([id, count]: any) => {

        const product = this.productsMap().get(id)

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
        defaultProducts: defaults,
        weight: this.defaultsWeight,
        additionalProducts: {}
      }

    }

    this.save.emit(result)


    if (this.creating) {
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
    this.creating = false;
  }

}
