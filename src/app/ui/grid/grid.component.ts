import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'ui-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent {

  @Input() columns?: number
  @Input() min = 200
  @Input() gap = 16

  @Input() alignX: 'start' | 'center' | 'end' | 'stretch' = 'stretch'
  @Input() alignY: 'start' | 'center' | 'end' | 'stretch' = 'stretch'

  get template(): string {

    if (this.columns) {
      return `repeat(${this.columns}, 1fr)`
    }

    return `repeat(auto-fit, minmax(${this.min}px, 1fr))`
  }

  get styles() {
    return {
      gridTemplateColumns: this.template,
      gap: `${this.gap}px`,
      justifyItems: this.alignX,
      alignItems: this.alignY
    }
  }

}
