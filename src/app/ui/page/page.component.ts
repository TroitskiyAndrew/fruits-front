import { Component } from '@angular/core';

@Component({
  selector: 'ui-page',
  standalone: true,
  template: `<div class="page"><ng-content/></div>`
})
export class PageComponent { }
