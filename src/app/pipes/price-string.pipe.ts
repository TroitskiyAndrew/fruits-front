import { Pipe, PipeTransform } from '@angular/core';
import { StateService } from '../services/state.service';
import { Currency } from '../models/models';

@Pipe({
  name: 'priceString'
})
export class PriceStringPipe implements PipeTransform {

  constructor(private stateService: StateService){}

  transform(value: number ): string {
    return value + (this.stateService.currency() === Currency.VND ? 'k' : '')
  }

}
