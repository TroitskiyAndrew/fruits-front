import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `

<button
class="btn"
[ngClass]="type"
>

<ng-content/>

</button>

`
})
export class ButtonComponent {

  @Input() type = 'btn-primary'

}
