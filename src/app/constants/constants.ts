import { Currency } from "../models/models";
import { TogglerButton } from "../ui/toggler/toggler.component";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.Rub]: '₽',
  [Currency.VND]: 'VND',
  [Currency.USDT]: '$',
}

export const CURRENCY_OPTIONS = [
  { label: CURRENCY_SYMBOLS[Currency.Rub], value: Currency.Rub },
  { label: CURRENCY_SYMBOLS[Currency.VND], value: Currency.VND },
  { label: CURRENCY_SYMBOLS[Currency.USDT], value: Currency.USDT },
]

export const CURRENCY_BUTTONS: TogglerButton[] = [
  { icon: 'fa-ruble-sign', value: Currency.Rub, size: 'm' },
  { icon: 'fa-dong-sign', value: Currency.VND, size: 'm' },
  // { content: 'VND', value: Currency.VND, size: 'm' },
  { icon: 'fa-dollar-sign', value: Currency.USDT, size: 'm' },
]

export const DEFAULT_CURRENCY = Currency.Rub;
