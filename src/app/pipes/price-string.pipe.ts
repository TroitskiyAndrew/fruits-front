import { Pipe, PipeTransform } from '@angular/core';
import { StateService } from '../services/state.service';
import { Currency } from '../models/models';

@Pipe({
  name: 'priceString'
})
export class PriceStringPipe implements PipeTransform {

  constructor(private stateService: StateService){}

  transform(value: number, currency = this.stateService.currency() ): string {
    return value + (currency === Currency.VND ? 'k' : '')
  }

}
