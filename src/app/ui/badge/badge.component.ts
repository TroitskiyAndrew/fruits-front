import { Component } from '@angular/core';

@Component({
selector:'ui-badge',
standalone:true,
template:`<span class="badge"><ng-content/></span>`
})
export class BadgeComponent{}
