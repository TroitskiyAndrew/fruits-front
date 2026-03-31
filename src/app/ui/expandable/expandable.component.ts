import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CardComponent } from '../card/card.component'
import { RowComponent } from '../row/row.component'
import { StackComponent } from '../stack/stack.component'
import { ButtonComponent } from '../button/button.component'

@Component({
  selector: 'ui-expandable',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    RowComponent,
    StackComponent,
    ButtonComponent
  ],
  templateUrl: './expandable.component.html'
})
export class ExpandableComponent {

  @Input() title = ''
  @Input() opened = false

  toggle() {
    this.opened = !this.opened
  }

}
