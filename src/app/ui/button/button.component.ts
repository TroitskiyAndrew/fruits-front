import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary'

  @Input() size: 'm' | 's' | '0' = 'm'

  @Input() icon = false

  @Input() btnClass = ''

  @Input() disabled = false

  @Input() loading = false

  @Input() link?: string

  @Input() text: string = ''

  // 🔥 NEW
  @Input() fa?: string
  @Input() iconRight = false

  @Output() action = new EventEmitter<void>()

  constructor(private router: Router){}

  click(event: Event){
    event.stopPropagation()
    if(this.disabled || this.loading) return

    if(this.link){
      this.router.navigate([this.link])
    } else {
      this.action.emit()
    }
  }

}
