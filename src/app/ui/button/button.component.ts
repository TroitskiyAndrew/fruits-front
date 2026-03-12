import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';

  @Input() size: 'm' | 's' = 'm';

  @Input() icon = false;

  @Input() disabled = false;

  @Input() loading = false;

  @Input() link?: string;

  @Output() action = new EventEmitter<void>();

  click(){
    if(this.disabled || this.loading) return
    this.action.emit()
  }

}
