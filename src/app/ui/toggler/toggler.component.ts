import { Component, Input, forwardRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export interface TogglerOption {
  label: string
  value: any
}

@Component({
  selector: 'ui-toggler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggler.component.html',
  styleUrl: './toggler.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TogglerComponent),
      multi: true
    }
  ]
})
export class TogglerComponent implements ControlValueAccessor {

  @Input() options: TogglerOption[] = []

  value: any

  onChange = (v: any) => {}
  onTouched = () => {}

  select(v: any) {

    this.value = v
    this.onChange(v)
    this.onTouched()

  }

  writeValue(v: any): void {
    this.value = v
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

}
