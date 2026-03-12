import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-input',
  standalone: true,
  template: `

<input
class="input"
[placeholder]="placeholder"
/>

`
})
export class InputComponent {

  @Input() placeholder = ''

}
