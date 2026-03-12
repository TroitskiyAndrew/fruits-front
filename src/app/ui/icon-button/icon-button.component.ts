import { Component } from '@angular/core';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  template: `

<button class="btn-outline">
<ng-content/>
</button>

`
})
export class IconButtonComponent { }
