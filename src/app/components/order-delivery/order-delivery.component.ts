import { Component, computed, effect, input, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IOrderDelivery, Currency, ControlsOf, PlaceType, DeliveryType } from '../../models/models';
import { StateService } from '../../services/state.service';
import { StackComponent } from "../../ui/stack/stack.component";
import { InputComponent } from "../../ui/input/input.component";
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'order-delivery',
  imports: [ReactiveFormsModule, StackComponent, InputComponent, TogglerComponent],
  templateUrl: './order-delivery.component.html',
  styleUrl: './order-delivery.component.scss'
})
export class OrderDeliveryComponent {
  delivery = input<IOrderDelivery>()
  cartTotal = computed(() => this.stateService.cartTotal());
  currencySymbol = computed(() => this.stateService.currencySymbol());
  Currency = Currency;

  form = new FormGroup<ControlsOf<IOrderDelivery>>({
    name: new FormControl('', { nonNullable: true }),
    contact: new FormControl('', { nonNullable: true }),
    placeType: new FormControl(PlaceType.Hotel, { nonNullable: true }),
    place: new FormControl('', { nonNullable: true }),
    placeAdd: new FormControl('', { nonNullable: true }),
    date: new FormControl('', { nonNullable: true }),
    deliveryType: new FormControl(DeliveryType.Reception, { nonNullable: true }),
  });

  constructor(private stateService: StateService) {
    effect(() => {
      const delivery = this.delivery();

      if (delivery) {
        this.form.patchValue(delivery, { emitEvent: false });
      }
    });
    this.form.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe(value => {
      // @ts-ignore
      this.stateService.delivery = this.form.valid ? value : null;
    });
  }

  deliveryPlaceOptions = [
    { label: 'В отель', value: PlaceType.Hotel },
    { label: 'В аэропорт', value: PlaceType.Airport }
  ]

  deliveryTypeOptions = [
    { label: 'На ресепшен', value: DeliveryType.Reception },
    { label: 'Лично в руки', value: DeliveryType.Hands }
  ]

  get isHotel() {
    return this.form.value.placeType === PlaceType.Hotel
  }

}
