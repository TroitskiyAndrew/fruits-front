import { Component } from '@angular/core';

@Component({
selector:'ui-filter-bar',
standalone:true,
template:`<div class="filter-bar"><ng-content/></div>`
})
export class FilterBarComponent{}
