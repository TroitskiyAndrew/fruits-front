import { Component } from '@angular/core';

@Component({
  selector: 'ui-section',
  standalone: true,
  template: `

<div class="col gap-m">

<div class="title">
<ng-content select="[title]"/>
</div>

<ng-content/>

</div>

`
})
export class SectionComponent { }
