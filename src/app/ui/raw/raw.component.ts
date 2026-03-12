import { Component } from '@angular/core';

@Component({
selector:'ui-row',
standalone:true,
template:`<div class="row"><ng-content/></div>`
})
export class RowComponent{}
