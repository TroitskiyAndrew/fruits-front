import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-price',
  standalone: true,
  template: `

<div class="price">
{{amount}} {{currency}}
</div>

`
})
export class PriceComponent {

  @Input() amount!: number
  @Input() currency!: string

}
