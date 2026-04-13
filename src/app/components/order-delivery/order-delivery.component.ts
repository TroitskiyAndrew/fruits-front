import { Component, computed, effect, EventEmitter, Input, input, Output, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IOrderDelivery, Currency, ControlsOf, PlaceType, DeliveryType, PaymentMethod } from '../../models/models';
import { StateService } from '../../services/state.service';
import { StackComponent } from "../../ui/stack/stack.component";
import { InputComponent } from "../../ui/input/input.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RowComponent } from "../../ui/row/row.component";
import { CommonModule } from '@angular/common';
import { DatetimeComponent } from "../../ui/datetime/datetime.component";
import { getMinimalDate } from '../../services/utils';
import { ButtonComponent } from "../../ui/button/button.component";
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

export enum OrderDeliveryPlace {
  PlacingOrder,
  OrderCard
}
@Component({
  selector: 'order-delivery',
  imports: [ReactiveFormsModule, StackComponent, InputComponent, TogglerComponent, RowComponent, CommonModule],
  templateUrl: './order-delivery.component.html',
  styleUrl: './order-delivery.component.scss'
})
export class OrderDeliveryComponent {
  @Input() delivery!: IOrderDelivery;
  @Input() usage: OrderDeliveryPlace = OrderDeliveryPlace.PlacingOrder;
  @Input() canCreateOrderOutside = true;
  @Output() deliverValue = new EventEmitter<IOrderDelivery | null>();
  OrderDeliveryPlace = OrderDeliveryPlace;
  DeliveryType = DeliveryType;
  PaymentMethod = PaymentMethod;
  PlaceType = PlaceType;

  form = new FormGroup<ControlsOf<IOrderDelivery>>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contact: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    placeType: new FormControl(PlaceType.Hotel, { nonNullable: true }),
    place: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    placeAdd: new FormControl('', { nonNullable: true }),
    date: new FormControl(this.getMinimalDate().number, { nonNullable: true, validators: [Validators.required] }),
    deliveryType: new FormControl(DeliveryType.Reception, { nonNullable: true }),
  });

  canCreateOrder = true;

  constructor(private stateService: StateService, private apiService: ApiService, private router: Router) {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value) {
          this.stateService.updateDelivery(value);
          this.canCreateOrder = true;
        } else {
          this.canCreateOrder = false
        }
      });
    this.form.controls.placeType.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if(value === PlaceType.Airport){
          this.form.controls.place.setValue('Аэропорт', {emitEvent: false})
        } else {
          this.form.controls.place.setValue('', {emitEvent: false})
        }
      });
  }

  ngOnInit() {
    this.form.patchValue(this.delivery);
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

  get isHotel() {
    return this.form.value.placeType === PlaceType.Hotel
  }

  getMinimalDate() {
    return getMinimalDate()
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

}
