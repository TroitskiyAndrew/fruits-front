import { Component, computed, input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IOrderDelivery, Currency, ControlsOf, PlaceType, DeliveryType } from '../../models/models';
import { StateService } from '../../services/state.service';
import { StackComponent } from "../../ui/stack/stack.component";
import { InputComponent } from "../../ui/input/input.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { RowComponent } from "../../ui/row/row.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { PriceStringPipe } from '../../pipes/price-string.pipe';

@Component({
  selector: 'order-delivery',
  imports: [ReactiveFormsModule, StackComponent, InputComponent, TogglerComponent, RowComponent, ButtonComponent, PriceStringPipe],
  templateUrl: './order-delivery.component.html',
  styleUrl: './order-delivery.component.scss'
})
export class OrderDeliveryComponent {
  delivery = input<IOrderDelivery>()
  cartTotal = computed(() => this.stateService.cartTotal());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  Currency = Currency;

  form = computed<FormGroup<ControlsOf<IOrderDelivery>>>(() => {
    const delivery = this.delivery();
    return new FormGroup<ControlsOf<IOrderDelivery>>({
      name: new FormControl(delivery?.name || '', { nonNullable: true }),
      contact: new FormControl(delivery?.contact || '', { nonNullable: true }),
      placeType: new FormControl(delivery?.placeType ?? PlaceType.Hotel, { nonNullable: true }),
      place: new FormControl(delivery?.place || '', { nonNullable: true }),
      placeAdd: new FormControl(delivery?.placeAdd || '', { nonNullable: true }),
      date: new FormControl(delivery?.date ?? '', { nonNullable: true }),
      deliveryType: new FormControl(delivery?.deliveryType || DeliveryType.Reception, { nonNullable: true }),
    })
  });

  constructor(private stateService: StateService) { }

  deliveryPlaceOptions = [
    { label: 'В отель', value: PlaceType.Hotel },
    { label: 'В аэропорт', value: PlaceType.Airport }
  ]

  deliveryTypeOptions = [
    { label: 'На ресепшен', value: DeliveryType.Reception },
    { label: 'Лично в руки', value: DeliveryType.Hands }
  ]

  get isHotel() {
    return this.form().value.place === PlaceType.Hotel
  }

  createOrder() {
    const value = this.form().getRawValue();
    console.log('ORDER', value)
  }

}
