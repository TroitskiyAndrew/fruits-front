import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { RowComponent } from "../row/row.component";
import { ButtonComponent } from "../button/button.component";

export interface TogglerOption {
  label: string
  value: any
}
export interface TogglerButton {
  icon?: string
  content?: string
  value: any
  size: any
}

@Component({
  selector: 'ui-toggler',
  standalone: true,
  imports: [CommonModule, RowComponent, ButtonComponent],
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
  @Input() buttons: TogglerButton[] = []
  @Input() rowClass = ''
  @Input() _disabled = false

  // 👉 теперь value можно передавать извне
  @Input() set value(v: any) {
    this._value = v
  }

  get value(): any {
    return this._value
  }

  @Output() valueChange = new EventEmitter<any>()
  @Output() showButtonsOptions = new EventEmitter<boolean>()

  private _value: any

  showOptions = false

  onChange = (v: any) => {}
  onTouched = () => {}

  select(v: any) {
    if(this._disabled) return
    if (this._value === v) return

    this._value = v

    // reactive forms
    this.onChange(v)
    this.onTouched()

    // внешний биндинг
    this.valueChange.emit(v)
  }

  onClickButton(v: any) {
    if(this.showOptions) {
      this.showOptions = false;
      this.showButtonsOptions.emit(false)
      this.select(v);
    } else {
      this.showOptions = true;
      this.showButtonsOptions.emit(true)
    }
  }

  writeValue(v: any): void {
    this._value = v
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
}
