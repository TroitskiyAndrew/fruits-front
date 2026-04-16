import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { RowComponent } from "../row/row.component";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, RowComponent, ButtonComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {

  @Input() label = ''
  @Input() placeholder = ''
  @Input() type: 'text' | 'number' | 'date' | 'time' = 'text'
  @Input() clearable = false;
  @Input() form?: FormGroup;

  @Input() value: any = ''
  @Input() formControlName: any = ''

  @Input() min: string | number | null = null
  @Input() step: string | number | null = null

  disabled = false

  onChange: any = () => { }
  onTouched: any = () => { }

  writeValue(value: any) {
    if(this.type === 'date') {
      this.value = new Date(value).toISOString().slice(0, 10)
    } else {
      this.value = value
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled
  }

  change(value: any) {
    this.value = value
    this.onChange(value)
  }

  clearInput() {
    this.value = ''
    this.onChange('')
  }

  get isRequired (){
    return this.form ? this.form.controls[this.formControlName].hasValidator(Validators.required) : false
  }

}
