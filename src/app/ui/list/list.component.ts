import { Component } from '@angular/core';

@Component({
selector:'ui-list',
standalone:true,
template:`<div class="list"><ng-content/></div>`
})
export class ListComponent{}
