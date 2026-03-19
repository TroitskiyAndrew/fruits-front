import { Currency } from "../models/models";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.Rub]: '₽',
  [Currency.VND]: '₫',
  [Currency.USDT]: '$',
}
