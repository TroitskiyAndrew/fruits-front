import { Component, computed, effect, EventEmitter, Input, input, Output, signal } from '@angular/core';
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { StackComponent } from "../../ui/stack/stack.component";
import { ProductCardComponent, ProductCardPlace } from "../product-card/product-card.component";
import { CURRENCY_OPTIONS } from '../../constants/constants';
import { ControlsOf, Currency, IOrderContent, ISet, ISetProducts, ISimpleProduct, OrderProduct, Product, ProductForm } from '../../models/models';
import { StateService } from '../../services/state.service';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getTotal } from '../../services/utils';
import { CheckboxComponent } from "../../ui/checkbox/checkbox.component";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'order-content',
  imports: [ReactiveFormsModule, StackComponent, ProductCardComponent, CheckboxComponent],
  templateUrl: './order-content.component.html',
  styleUrl: './order-content.component.scss'
})
export class OrderContentComponent {

  @Input() content!: IOrderContent;
  @Output() updateContent = new EventEmitter<IOrderContent>();

  currencyOptions = CURRENCY_OPTIONS;
  ProductCardPlace = ProductCardPlace;
  orderAddons = computed(() => this.stateService.orderAddons());
  orderAddonsNamesMap = computed(() => this.stateService.orderAddons().reduce((map: Map<string, string>, product: Product) => {
    map.set(product.id, product.name);
    return map;
  }, new Map()));
  addonsForm = new FormGroup<ControlsOf<Record<string, boolean>>>({})
  triggerAddonsForm = signal(false);
  get orderAddonsKeys(){
    return Array(...Object.keys(this.addonsForm.controls))
  }
  addonsFormChange = toSignal(this.addonsForm.valueChanges, { initialValue: {} });

  deliveryOptions = [
    { label: 'Обычная доставка', value: false },
    { label: 'Экспресс доставка', value: true }
  ]

  get products (){
    return this.content.products.filter(p => !p.orderAddon)
  }
  constructor(public stateService: StateService) {
    effect(() => {
      this.triggerAddonsForm();
      const addonsGroup = this.addonsForm as FormGroup;
      Object.keys(addonsGroup.controls).forEach(key => {
        addonsGroup.removeControl(key);
      });
      this.stateService.orderAddons().forEach(prod => {
        addonsGroup.addControl(
          prod.id,
          new FormControl(
            this.content.products.map(p => p.id).includes(prod.id),
            { nonNullable: true }
          )
        )
      })
    });
    effect(() => {
      const addons = this.addonsFormChange();
      const includedAddons = [...Object.entries(addons)].map(([id, state]: [string, boolean| undefined]) => {
        return state ? id : null;
      }).filter(Boolean) as string[];
      const products = this.content.products.filter(p => !p.orderAddon);
      const addonProducts = this.orderAddons().filter(p => includedAddons.includes(p.id))
      this.content.products = [...products, ...addonProducts.map(addon => ({...addon, count: 1}))];
      this.calculateTotal()
    });
  }

  ngOnInit() {
    // this.triggerAddonsForm.update(val => !val);
  }

  calculateTotal() {
    this.content.prices = getTotal(this.content);
    this.updateContent.emit(this.content);
  }

  changeContent(product: ISet, index: number) {
    this.content.products[index] = { ...product, count: 1 };
    this.calculateTotal()
  }
  deleteContent(index: number) {
    this.content.products = this.content.products.filter((_, i) => i !== index);
    this.calculateTotal()
  }

}
