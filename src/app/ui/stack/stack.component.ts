import { Component } from '@angular/core';

@Component({
selector:'ui-stack',
standalone:true,
template:`<div class="col gap-m"><ng-content/></div>`
})
export class StackComponent{}
