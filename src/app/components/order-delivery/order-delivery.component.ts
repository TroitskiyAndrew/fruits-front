import { Component, computed, effect, EventEmitter, Input, input, Output, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IOrderDelivery, Currency, ControlsOf, PlaceType, DeliveryType } from '../../models/models';
import { StateService } from '../../services/state.service';
import { StackComponent } from "../../ui/stack/stack.component";
import { InputComponent } from "../../ui/input/input.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RowComponent } from "../../ui/row/row.component";
import { CommonModule } from '@angular/common';
import { DatetimeComponent } from "../../ui/datetime/datetime.component";

export enum OrderDeliveryPlace {
  PlacingOrderPage,
  OrderCard
}
@Component({
  selector: 'order-delivery',
  imports: [ReactiveFormsModule, StackComponent, InputComponent, TogglerComponent, RowComponent, CommonModule, DatetimeComponent],
  templateUrl: './order-delivery.component.html',
  styleUrl: './order-delivery.component.scss'
})
export class OrderDeliveryComponent {
  @Input() delivery!: IOrderDelivery;
  @Input() usage: OrderDeliveryPlace = OrderDeliveryPlace.PlacingOrderPage;
  @Output() deliverValue = new EventEmitter<IOrderDelivery | null>();
  OrderDeliveryPlace = OrderDeliveryPlace;
  PlaceType = PlaceType;

  form = new FormGroup<ControlsOf<IOrderDelivery>>({
    name: new FormControl('', { nonNullable: true }),
    contact: new FormControl('', { nonNullable: true }),
    placeType: new FormControl(PlaceType.Hotel, { nonNullable: true }),
    place: new FormControl('', { nonNullable: true }),
    placeAdd: new FormControl('', { nonNullable: true }),
    date: new FormControl(Date.now(), { nonNullable: true }),
    deliveryType: new FormControl(DeliveryType.Reception, { nonNullable: true }),
  });

  constructor(private stateService: StateService) {
    this.form.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe(value => {
      //@ts-ignore
      this.deliverValue.emit(this.form.valid ? value : null);
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

}
