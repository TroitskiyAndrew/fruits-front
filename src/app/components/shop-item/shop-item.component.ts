import { Component, Input, Output, EventEmitter, OnInit, computed, HostListener, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { Currency, ISet, ISetProducts, ISimpleProduct, Measure, Product } from '../../models/models'

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
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'shop-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    StackComponent,
    RowComponent,
    ButtonComponent,
    CounterComponent,
    GridComponent
  ],
  templateUrl: './shop-item.component.html',
  styleUrl: './shop-item.component.scss'
})
export class ShopItemComponent implements OnInit {

  @Input() product?: ISet;
  @Input() editable = false
  @Input() currency: Currency = Currency.Rub;
  Currency = Currency;
  products = computed(() => {
    return this.stateService.products().filter(p => !p.set)
  })
  productsMap = computed<Map<string, ISimpleProduct>>(() => this.products().reduce((map, product) => {
    map.set(product.id, product);
    return map;
  }, new Map()));

  @Output() choose = new EventEmitter<string>()
  @Output() addToCart = new EventEmitter<Product>()
  @Output() cancelEvent = new EventEmitter();


  trigger = signal<boolean>(false)
  form = computed(() => {
    this.trigger()
    const p = this.product as ISet | undefined

    const defaults: Record<string, any> = {}
    if (p?.set) {
      this.products().forEach(prod => {
        defaults[prod.id] = p?.defaultProducts?.[prod.id]?.count ?? 0
      })
    }

    return this.fb.group({

      name: [this.product?.name ?? ''],
      description: [this.product?.description ?? ''],
      measure: [this.product?.measure ?? Measure.KG],
      weight: [this.product?.weight ?? 1],
      amount: [this.product?.amount ?? 1],

      priceRub: [this.product?.price?.rub ?? 0],
      priceVnd: [this.product?.price?.vnd ?? 0],
      priceUsdt: [this.product?.price?.usdt ?? 0],

      defaultProducts: this.fb.group(defaults)

    })

  })

  editing = false;
  showProducts = false;

  measureOptions = [
    { label: 'шт', value: Measure.Item },
    { label: 'кг', value: Measure.KG }
  ]

  typeOptions = [
    { label: 'Продукт', value: false },
    { label: 'Набор', value: true }
  ];
  @HostListener('click', [])
  onHostClick() {
    if (!this.editing) {
      this.startEdit()
    }
  }

  constructor(private fb: FormBuilder, private stateService: StateService, private apiService: ApiService) { }

  ngOnInit(): void {

    if (!this.product) {
      this.editing = true;
    }

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

  get totalPrice(): number {
    const obj = (this.form().get('defaultProducts') as FormGroup).getRawValue() as Record<string, number>;
    return (this.product?.price[this.currency] || 0) +  Object.entries(obj).reduce((acc: number, entry) => {
      const product = this.productsMap().get(entry[0])
      acc += (product?.price[this.currency] || 0) * entry[1];
      return acc;
    }, 0);
  }

  startEdit() {
    this.editing = true;
    this.showProducts = true;
    this.choose.emit(this.product?.id)
  }

  triggerForm() {
    this.trigger.set(!this.trigger())
  }

  cancel() {
    this.cancelEvent.emit();
    this.showProducts = false;
    this.triggerForm();
    setTimeout(() => this.editing = false, 0)

  }

  async saveProduct() {

    const v = this.form().value

    const base = {
      id: this.product?.id ?? crypto.randomUUID(),
      name: v.name || '',
      description: v.description || '',
      measure: v.measure!,
      amount: Number(v.amount),
      weight: Number(v.weight),
      deleted: false,
      price: {
        rub: Number(v.priceRub),
        vnd: Number(v.priceVnd),
        usdt: Number(v.priceUsdt)
      },
      set: true
    }
    const defaults: ISetProducts = {}
    Object.entries(v.defaultProducts as Record<string, number>).forEach(([id, count]: any) => {

      const product = this.productsMap().get(id)

      if (product && count > 0) {
        defaults[id] = {
          ...product,
          count
        }
      }

    })


    let result: ISet = {
      ...base,
      set: true,
      defaultProducts: defaults,
      weight: this.defaultsWeight,
      additionalProducts: {}
    }

    this.addToCart.emit(result)

    this.editing = false;
  }

}
