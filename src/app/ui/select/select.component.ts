import {
  Component,
  Input,
  forwardRef
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {

  @Input() label = '';
  @Input() options: { label: string; value: any }[] = [];

  @Input() value: any = null;
  disabled = false;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChangeSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const index = select.selectedIndex;

    const option = this.options[index];
    const value = option?.value ?? null;

    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  // 🔑 ключ — свой compare
  compareWith = (a: any, b: any): boolean => {
    return a === b;
  };
}
