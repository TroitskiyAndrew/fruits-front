import {
  Directive,
  Input,
  ViewContainerRef,
  ComponentRef,
  inject
} from '@angular/core'

import { LoaderComponent } from './loader.component'

@Directive({
  selector: '[uiLoader]',
  standalone: true
})
export class LoaderDirective {

  private vcr = inject(ViewContainerRef)

  private loaderRef: ComponentRef<LoaderComponent> | null = null

  private timer: any = null
  private isActive = false

  @Input()
  set uiLoader(value: boolean) {

    this.isActive = value

    if (value) {
      this.startDelay()
    } else {
      this.clearDelay()
      this.hide()
    }

  }

  private startDelay() {

    if (this.timer) return

    this.timer = setTimeout(() => {

      this.timer = null

      if (this.isActive) {
        this.show()
      }

    }, 300)

  }

  private clearDelay() {

    if (!this.timer) return

    clearTimeout(this.timer)
    this.timer = null

  }

  private show() {

    if (this.loaderRef) return

    const host = this.vcr.element.nativeElement as HTMLElement

    const style = getComputedStyle(host)
    if (style.position === 'static') {
      host.style.position = 'relative'
    }

    this.loaderRef = this.vcr.createComponent(LoaderComponent)

    const el = this.loaderRef.location.nativeElement as HTMLElement

    el.style.position = 'absolute'
    el.style.inset = '0'

    host.appendChild(el)
  }

  private hide() {

    if (!this.loaderRef) return

    this.loaderRef.destroy()
    this.loaderRef = null

  }

}
