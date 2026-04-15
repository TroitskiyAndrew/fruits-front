import { Component, computed, effect, EventEmitter, Input, input, Output, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IOrderDelivery, Currency, ControlsOf, PlaceType, DeliveryType, PaymentMethod, OrderDeliveryForm, Delivery, DefaultAddonBy } from '../../models/models';
import { StateService } from '../../services/state.service';
import { StackComponent } from "../../ui/stack/stack.component";
import { InputComponent } from "../../ui/input/input.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RowComponent } from "../../ui/row/row.component";
import { CommonModule } from '@angular/common';
import { DatetimeComponent } from "../../ui/datetime/datetime.component";
import { chooseDefaultDelivery, getMinimalDate } from '../../services/utils';
import { ButtonComponent } from "../../ui/button/button.component";
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CURRENCY_SYMBOLS } from '../../constants/constants';
import { PriceStringPipe } from '../../pipes/price-string.pipe';
import { AddonCardComponent, ToggleAddon } from "../addon-card/addon-card.component";

export enum OrderDeliveryPlace {
  PlacingOrder,
  OrderCard
}
@Component({
  selector: 'order-delivery',
  imports: [ReactiveFormsModule, StackComponent, InputComponent, TogglerComponent, RowComponent, CommonModule, PriceStringPipe, AddonCardComponent],
  templateUrl: './order-delivery.component.html',
  styleUrl: './order-delivery.component.scss'
})
export class OrderDeliveryComponent {
  @Input() delivery!: IOrderDelivery;
  @Input() usage: OrderDeliveryPlace = OrderDeliveryPlace.PlacingOrder;
  @Input() canCreateOrderOutside = true;
  @Input() currency!: Currency;
  @Output() deliverValue = new EventEmitter<IOrderDelivery | null>();
  OrderDeliveryPlace = OrderDeliveryPlace;
  DeliveryType = DeliveryType;
  PaymentMethod = PaymentMethod;
  PlaceType = PlaceType;
  CURRENCY_SYMBOLS = CURRENCY_SYMBOLS;
  DefaultAddonBy = DefaultAddonBy;
  get deliverProduct() {
    const deliveryProductId = this.form.controls.deliveryProductId.value;
    return this.stateService.deliveriesMap().get(deliveryProductId)!
  }

  minimalDate = getMinimalDate();

  form = new FormGroup<ControlsOf<OrderDeliveryForm>>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contact: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    placeType: new FormControl(PlaceType.Hotel, { nonNullable: true }),
    place: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    placeAdd: new FormControl('', { nonNullable: true }),
    date: new FormControl(this.minimalDate.number, { nonNullable: true, validators: [Validators.required] }),
    deliveryType: new FormControl(DeliveryType.Reception, { nonNullable: true }),
    deliveryProductId: new FormControl('', { nonNullable: true }),
  });


  canCreateOrder = true;

  get isDefaultDelivery() {
    const deliveryProductId = this.form.controls.deliveryProductId.value;
    return this.stateService.deliveriesMap().get(deliveryProductId)!.default !== DefaultAddonBy.None
  }

  get additionalDelivery() {
    return this.stateService.deliveries().find(delivery => delivery.default === DefaultAddonBy.None)
  }


  get disableAddons() {
    return this.usage === OrderDeliveryPlace.OrderCard
  }

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router) {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {

        const { deliveryProductId, ...delivery } = value;
        const deliveryProduct = this.stateService.deliveriesMap().get(deliveryProductId || '');
        const newDelivery = {...delivery, deliveryProduct} as  IOrderDelivery
        this.deliverValue.emit(this.form.valid ? newDelivery : null)
      });
    this.form.controls.placeType.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value === PlaceType.Airport) {
          this.form.controls.place.setValue('Аэропорт', { emitEvent: false })
        } else {
          this.form.controls.place.setValue('', { emitEvent: false })
        }
      });
      effect(() => {
        const delivery = this.stateService.orderDelivery().deliveryProduct;
        this.minimalDate = getMinimalDate(delivery.default === DefaultAddonBy.None)
        if(this.usage === OrderDeliveryPlace.PlacingOrder){
          this.form.controls.deliveryProductId.setValue(delivery.id, {emitEvent: false})
        }
      })
  }

  ngOnInit() {
    const { deliveryProduct, ...delivery } = this.delivery;

    this.form.patchValue({
      ...delivery,
      deliveryProductId: deliveryProduct.id
    });
  }

  deliveryPlaceOptions = [
    { label: 'В отель', value: PlaceType.Hotel },
    { label: 'В аэропорт', value: PlaceType.Airport }
  ]

  get deliveryPlace() {
    return this.deliveryPlaceOptions.filter(o => o.value === this.delivery.placeType)
  }

  deliveryTypeOptions = [
    { label: 'На ресепшен', value: DeliveryType.Reception },
    { label: 'Лично в руки', value: DeliveryType.Hands }
  ]

  get deliveryType() {
    return this.deliveryTypeOptions.filter(o => o.value === this.delivery.deliveryType)
  }

  get freeDeliveryFromPice(){
    if(this.deliverProduct.default !== DefaultAddonBy.None){
      return 0;
    }
    const freeDelivery = this.stateService.deliveries().find(d => d.default === DefaultAddonBy.Price);
    return freeDelivery?.minPrice?.[this.currency] || 0;
  }

  get freeDeliveryFromCount(){
    if(this.deliverProduct.default !== DefaultAddonBy.Unconditional){
      return 0;
    }
    const freeDelivery = this.stateService.deliveries().find(d => d.default === DefaultAddonBy.Count);
    return freeDelivery?.minCount || 0;
  }

  get isHotel() {
    return this.form.value.placeType === PlaceType.Hotel
  }

  async createOrder(method: PaymentMethod) {
    const order = this.stateService.order();
    this.stateService.load(true);
    const newOrderInfo = await this.apiService.createOrder(order, method);
    this.stateService.load(false);
    if (newOrderInfo) {
      const { order, payment } = newOrderInfo;
      this.stateService.orders.update((orders) => [...orders, order]);
      this.stateService.payments.update((payments) => [...payments, payment]);
      if (method === PaymentMethod.Bank) {
        this.router.navigate(['online-payment', payment.id]);
      } else {
        this.stateService.dropOrder();
        this.router.navigate(['order-placed']);
      }

    }
  }

  deliveryOptions = computed(() => {
    const deliveries = this.stateService.deliveries();
    const cartTotal = this.stateService.cartTotal()
    const cartCount = this.stateService.cart().length
    const { defaultDeliveries, addon } = deliveries.reduce<{ defaultDeliveries: Delivery[], addon: Delivery[] }>((acc, delivery) => {
      delivery.default === DefaultAddonBy.None ?  acc.addon.push(delivery) : acc.defaultDeliveries.push(delivery);
      return acc
    }, { defaultDeliveries: [], addon: [] });

    const result = [chooseDefaultDelivery(defaultDeliveries, this.currency, cartTotal, cartCount), ...addon].filter(Boolean).map(delivery => ({ label: delivery!.name, value: delivery!.id }))
    console.log(result, this.delivery.deliveryProduct.id)
    return result;
  })

  changeDeliveryProduct(options: ToggleAddon) {

    let delivery: Delivery;
    if(options.selected){
      delivery = options.addon as Delivery
    } else {
      const deliveries = this.stateService.deliveries();
      const defaultDeliveries = deliveries.filter(d => d.default !== DefaultAddonBy.None)
      delivery = chooseDefaultDelivery(defaultDeliveries, this.currency, this.stateService.cartTotal(), this.stateService.cart().length)
    }
    this.form.controls.deliveryProductId.setValue(delivery.id)
    if(this.usage === OrderDeliveryPlace.PlacingOrder){
      this.stateService.updateDelivery({
        deliveryProduct: delivery
      })

    }
    const date = new Date()
    if(delivery.default !== DefaultAddonBy.None){
      date.setDate(date.getDate() + 1)
    }
    this.form.controls.date.setValue(date.getTime())
  }



}
