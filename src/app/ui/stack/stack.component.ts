import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stack.component.html',
})
export class StackComponent {
  @Input() stackClass = '';
}
