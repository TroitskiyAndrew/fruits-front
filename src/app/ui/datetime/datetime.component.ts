import {
  Component,
  forwardRef
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms'

import { InputComponent } from '../input/input.component'
import { RowComponent } from '../row/row.component'
import { SelectComponent } from '../select/select.component'

@Component({
  selector: 'ui-datetime',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    RowComponent,
    SelectComponent
  ],
  templateUrl: './datetime.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimeComponent),
      multi: true
    }
  ]
})
export class DatetimeComponent implements ControlValueAccessor {

  date = ''
  time = ''

  minDate = ''
  minTime = '15:00'

  timeOptions: { label: string; value: string }[] = []

  onChange = (v: number | null) => {}
  onTouched = () => {}

  constructor() {
    this.setMin()
    this.generateTimeOptions()
  }

  writeValue(timestamp: number | null): void {

    if (!timestamp) {
      this.date = ''
      this.time = ''
      return
    }

    const d = new Date(timestamp)

    this.date = d.toISOString().slice(0, 10)
    this.time = d.toTimeString().slice(0, 5)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  changeDate(value: string) {
    this.date = value
    this.generateTimeOptions()

    if (this.time && !this.isTimeValid(this.time)) {
      this.time = this.timeOptions[0]?.value || ''
    }

    this.emit()
  }

  changeTime(value: any) {
    console.log(value)
    // this.time = value
    this.emit()
  }

  private emit() {

    if (!this.date) {
      this.onChange(null)
      return
    }

    const time = this.time || this.timeOptions[0]?.value || '00:00'

    const result = new Date(`${this.date}T${time}`).getTime()

    this.onChange(result)
    this.onTouched()
  }

  private setMin() {

    const now = new Date()

    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    const afterTomorrow = new Date()
    afterTomorrow.setDate(today.getDate() + 2)
    if (now.getHours() < 18) {
      this.minDate = this.formatDate(tomorrow)
    } else {
      this.minDate = this.formatDate(afterTomorrow)
    }
  }

  private generateTimeOptions() {

    const result: { label: string; value: string }[] = []

    for (let h = 18; h < 21; h++) {

      const hh = String(h).padStart(2, '0')
      const value = `${hh}:00`

      if (this.date === this.minDate) {
        if (value < this.minTime) continue
      }

      result.push({
        label: value,
        value
      })
    }

    this.timeOptions = result
  }

  private isTimeValid(time: string): boolean {
    return this.timeOptions.some(t => t.value === time)
  }

  private formatDate(d: Date): string {
    return d.toISOString().slice(0, 10)
  }

}
