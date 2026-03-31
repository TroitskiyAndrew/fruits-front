import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms'

import { RowComponent } from '../row/row.component'

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {

  @Input() label = ''
  @Input() value = false
  @Input() disabled = false
  @Output() valueChange = new EventEmitter<boolean>()

  onChange = (v: boolean) => {}
  onTouched = () => {}

  writeValue(value: boolean): void {
    this.value = !!value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled
  }

  toggle() {
    if (this.disabled) return

    this.value = !this.value
    this.onChange(this.value)
    this.onTouched()
    this.valueChange.emit(this.value)
  }

}
