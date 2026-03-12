import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss']
})
export class UIButtonComponent {

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
