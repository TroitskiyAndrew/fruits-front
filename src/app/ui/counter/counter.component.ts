import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CounterComponent),
      multi: true
    }
  ]
})
export class CounterComponent implements ControlValueAccessor {

  @Input() min = 0
  @Output() valueChange = new EventEmitter<any>()
  @Input() blockDecrease = false

  value = 0

  onChange: any = () => {}
  onTouched: any = () => {}

  writeValue(value: number) {
    this.value = value || 0
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn
  }

  increase() {
    this.value++
    this.onChange(this.value);
    this.valueChange.emit(this.value)
  }

  decrease() {
    if (this.value > this.min && !this.blockDecrease) {
      this.value--
      this.onChange(this.value);
      this.valueChange.emit(this.value)
    }
  }

}
