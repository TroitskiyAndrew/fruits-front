import {
 Component,
 Input,
 forwardRef
} from '@angular/core';

import {
 ControlValueAccessor,
 NG_VALUE_ACCESSOR
} from '@angular/forms';

import { NgIf, NgClass } from '@angular/common';

@Component({
 selector: 'ui-input',
 standalone: true,
 imports: [NgIf, NgClass],
 templateUrl: './ui-input.component.html',
 styleUrls: ['./ui-input.component.scss'],
 providers: [
  {
   provide: NG_VALUE_ACCESSOR,
   useExisting: forwardRef(() => UIInputComponent),
   multi: true
  }
 ]
})
export class UIInputComponent implements ControlValueAccessor {

 @Input() type: 'text' | 'number' | 'search' | 'password' = 'text';

 @Input() placeholder = '';

 @Input() icon?: string;

 @Input() suffix?: string;

 @Input() clearable = false;

 @Input() disabled = false;

 value: any = '';

 onChange: any = () => {};
 onTouched: any = () => {};

 writeValue(value: any): void {
  this.value = value;
 }

 registerOnChange(fn: any): void {
  this.onChange = fn;
 }

 registerOnTouched(fn: any): void {
  this.onTouched = fn;
 }

 setDisabledState(disabled: boolean): void {
  this.disabled = disabled;
 }

 change(event: Event) {
  const input = event.target as HTMLInputElement;
  this.value = input.value;
  this.onChange(this.value);
 }

 clear() {
  this.value = '';
  this.onChange('');
 }

}
