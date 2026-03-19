import { Currency } from "../models/models";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.Rub]: '₽',
  [Currency.VND]: '₫',
  [Currency.USDT]: '$',
}

export const CURRENCY_OPTIONS = [
    { label: CURRENCY_SYMBOLS[Currency.Rub], value: Currency.Rub },
    { label: CURRENCY_SYMBOLS[Currency.VND], value: Currency.VND },
    { label: CURRENCY_SYMBOLS[Currency.USDT], value: Currency.USDT },
  ]
