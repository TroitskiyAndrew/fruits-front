import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
selector:'ui-row',
standalone:true,
template:`<div class="row" [ngClass]="rowClass"><ng-content/></div>`,
imports: [CommonModule]
})
export class RowComponent{
  @Input() rowClass = ''
}
