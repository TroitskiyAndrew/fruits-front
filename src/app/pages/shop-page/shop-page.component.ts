import { Component, computed, effect, signal } from '@angular/core';
import { Currency, ISet, Measure } from '../../models/models';
import { StackComponent } from '../../ui/stack/stack.component';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { InputComponent } from '../../ui/input/input.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';
import { PriceComponent } from '../../ui/price/price.component';
import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';
import { StateService } from '../../services/state.service';
import { ShopItemComponent } from '../../components/shop-item/shop-item.component';
import { FormControl } from '@angular/forms';
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'shop-page',
  standalone: true,
  imports: [CommonModule, StackComponent, PageComponent, ShopItemComponent, TogglerComponent],
  templateUrl: './shop-page.component.html'
})
export class ShopPageComponent {

  currencyOptions = [
    { label: '₽', value: Currency.Rub },
    { label: '₫', value: Currency.VND },
    { label: '$', value: Currency.USDT },
  ]
  Currency = Currency
  currencyVal = Currency.Rub;
  trigger = signal<boolean>(false)
  selectedSet = signal<string | null>(null)
  sets = computed(() => {
    const sets = this.stateService.products().filter(p => p.set);
    this.trigger()
    const mySet: ISet = {
      id: 'newSet',
      name: 'Свой набор',
      description: 'Выбрать самостоятельно',
      measure: Measure.Item,
      amount: 1,
      weight: 0,
      deleted: false,
      price: {
        [Currency.Rub]: 0,
        [Currency.VND]: 0,
        [Currency.USDT]: 0,
      },
      set: true,
      defaultProducts: {},
      additionalProducts: {},
    }
    return [...sets, mySet];
  });


  constructor(private stateService: StateService) { }

  selectSet(id: string) {
    this.selectedSet.set(id);
  }

  triggerSets() {
    this.trigger.set(!this.trigger())
  }

  cancelSelect() {
    this.triggerSets()
    this.selectedSet.set(null);
  }

}
