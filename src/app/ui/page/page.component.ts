import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { RowComponent } from "../row/row.component";
import { StateService } from '../../services/state.service';
import { CURRENCY_BUTTONS } from '../../constants/constants';
import { Currency } from '../../models/models';
import { StackComponent } from "../stack/stack.component";
import { TogglerComponent } from "../toggler/toggler.component";

@Component({
  selector: 'ui-page',
  standalone: true,
  template: ``,
  imports: [CommonModule, ButtonComponent, RowComponent, TogglerComponent],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  @Input() showBack: boolean = true;
  @Input() showCurrency = false;

  myAccountLink = computed(() => `account/${this.stateService.user().id}`);
  isAdmin = computed(() => this.stateService.isAdmin());
  cartCount = computed(() => this.stateService.cart().filter(p => !p.orderAddon).length);
  currency = computed(() => this.stateService.currency());
  currencyButtons = CURRENCY_BUTTONS;
  selectCurrency = false;

  constructor(private stateService: StateService, private location: Location){}

  goBack(){
    this.location.back()
  }

  changeCurrency(currency: Currency){
    this.stateService.changeCurrency(currency)
  }
}
