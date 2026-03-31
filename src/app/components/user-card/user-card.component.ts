import { Component, computed, effect, input, Input, signal } from '@angular/core';
import { AccountForm, ControlsOf, Currency, IAccount, IUser, OnlinePaymentOption, UserForm } from '../../models/models';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';
import { FilterBarComponent } from '../../ui/filter-bar/filter-bar.component';
import { InputComponent } from '../../ui/input/input.component';
import { ListComponent } from '../../ui/list/list.component';
import { PageComponent } from '../../ui/page/page.component';

import { RowComponent } from '../../ui/row/row.component';
import { SectionComponent } from '../../ui/section/section.component';
import { StackComponent } from '../../ui/stack/stack.component';
import { getEmptyUser } from '../../services/utils';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CURRENCY_OPTIONS, CURRENCY_SYMBOLS } from '../../constants/constants';
import { TogglerComponent } from "../../ui/toggler/toggler.component";
import { CheckboxComponent } from "../../ui/checkbox/checkbox.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { ExpandableComponent } from "../../ui/expandable/expandable.component";
import { environment } from '../../../environments/environment';
import { StateService } from '../../services/state.service';

export enum UserCardPlace {
  MyAccount
}

@Component({
  selector: 'user-card',
  standalone: true,
  imports: [CommonModule, StackComponent, CardComponent, TogglerComponent, CheckboxComponent, ReactiveFormsModule, InputComponent, ButtonComponent, RowComponent, ExpandableComponent],
  templateUrl: './user-card.component.html'
})
export class UserCardComponent {

  @Input() user = getEmptyUser();
  @Input() usage: UserCardPlace = UserCardPlace.MyAccount;
  UserCardPlace = UserCardPlace;
  currencyOptions = CURRENCY_OPTIONS;
  currency = signal<Currency>(Currency.Rub);
  currencySymbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  paymentOptions = [
    { label: 'Реквизиты', value: OnlinePaymentOption.Account },
    { label: 'QR-код', value: OnlinePaymentOption.QR },
  ]
  OnlinePaymentOption = OnlinePaymentOption;
  acceptCurrency = computed(() => this.paymentMethodsFormChanges()[this.currency()] !== null);
  canSavePaymentMethodChanges = computed(() => {
    this.canSavePaymentMethodTrigger()
    const value = this.paymentMethodsFormChanges()[this.currency()];
    const currentMethod = this.user.paymentMethods[this.currency()];
    if(value === currentMethod){
      return false;
    }
    if(value !== null) {
      const newMethod = this.getPaymentMethod(value);
      if(!newMethod.account) {
        return false;
      }
      if(currentMethod != null && currentMethod.paymentOption === newMethod.paymentOption && currentMethod.account === newMethod.account && currentMethod.comment === newMethod.comment) {
          return false
        }
    }
    return true;
  });
  canSavePaymentMethodTrigger = signal(false);

  form = new FormGroup<ControlsOf<UserForm>>({
    admin: new FormControl(false, { nonNullable: true }),
    paymentMethods: new FormGroup<ControlsOf<Record<Currency, IAccount | null>>>({
      [Currency.Rub]: new FormControl(null),
      [Currency.VND]: new FormControl(null),
      [Currency.USDT]: new FormControl(null),
    }),
  });

  get paymentMethodsForm(): FormGroup {
    return this.form.controls.paymentMethods as FormGroup
  }
  get currencyMethodForm(): FormGroup {
    return this.form.controls.paymentMethods.controls[this.currency()] as FormGroup
  }
  paymentMethodsFormChanges = toSignal(this.paymentMethodsForm.valueChanges, {
    initialValue: {
      [Currency.Rub]: null,
      [Currency.VND]: null,
      [Currency.USDT]: null,
    }
  });

  get qrLink() {
    return `${environment.backendUrl}/qr/${this.user.userId}`
  }

  constructor(private apiService: ApiService, private stateService: StateService) {
    effect(() => {
      const user = this.user;
      this.form.patchValue({ ...user, paymentMethods: {} });
      Object.keys(this.paymentMethodsForm.controls).forEach(key => {
        this.paymentMethodsForm.removeControl(key);
      });
      Object.entries(user.paymentMethods).forEach(([currency, account]) => {
        this.paymentMethodsForm.addControl(currency, account ? new FormGroup<ControlsOf<AccountForm>>({
          paymentOption: new FormControl(account.paymentOption, { nonNullable: true }),
          comment: new FormControl(account.comment, { nonNullable: true }),
          accountInfo: new FormControl(account.paymentOption === OnlinePaymentOption.Account ? account.account : '', { nonNullable: true }),
          qrUrl: new FormControl(account.paymentOption === OnlinePaymentOption.QR ? account.account : '', { nonNullable: true }),
        }) : new FormControl(null));
      })
      console.log('user form', this.form.getRawValue());
    });
  }

  acceptCurrencyChange(value: boolean) {
    const currency = this.currency();
    this.paymentMethodsForm.removeControl(currency);
    this.paymentMethodsForm.addControl(currency, value ? new FormGroup<ControlsOf<AccountForm>>({
      paymentOption: new FormControl(OnlinePaymentOption.Account, { nonNullable: true }),
      comment: new FormControl('', { nonNullable: true }),
      accountInfo: new FormControl('', { nonNullable: true }),
      qrUrl: new FormControl('', { nonNullable: true }),
    }) : new FormControl(null));
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const image = await this.apiService.uploadPhoto(file);
    this.currencyMethodForm.controls['qrUrl'].setValue(image);
  }

  getPaymentMethod(formValue: AccountForm): IAccount {
    return {
      paymentOption: formValue.paymentOption,
      account: formValue.paymentOption === OnlinePaymentOption.Account ? (formValue.accountInfo || '') : (formValue.qrUrl || ''),
      comment: formValue.comment,
    }
  }

  async savePaymentMethods() {
    const formValue = this.form.controls.paymentMethods.controls[this.currency()].value;
    const newMethod = formValue ?  this.getPaymentMethod(formValue) : null;
    const user = this.user;
    const newPaymentMethods = {
      ...user.paymentMethods,
      [this.currency()]: newMethod,
    }
    await this.apiService.updateUser({
      id: user.id,
      paymentMethods: newPaymentMethods
    }).then(updatedUser => {
      if(updatedUser){
        this.user = {
          ...user,
          paymentMethods: newPaymentMethods
        }
        alert('Способ оплаты сохранен');
        this.canSavePaymentMethodTrigger.update(v => !v);
      }
    })
  }

  async downloadReferralQR() {
    const response = await fetch(this.qrLink);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr.png';
    link.click();

    window.URL.revokeObjectURL(url);
  }

  copyReferralToClipboard() {
    navigator.clipboard.writeText(`${this.stateService.config().referralUrlBase}${this.user.userId}`)
  }
}
