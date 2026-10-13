import { Currency } from '@/types-enums'

// @currency-updates
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.CHF]: 'CHF',
  [Currency.ZAR]: 'R',
  [Currency.BTC]: '₿',
  [Currency.JPY]: '¥',
  [Currency.CNY]: '¥',
  [Currency.INR]: '₹',
  [Currency.RUB]: '₽',
  [Currency.SEK]: 'kr',
}

export const getCurrencySymbol = (currency: Currency): string => {
  return CURRENCY_SYMBOLS[currency]
}

export const getMaxDecimalsForCurrency = (currency: Currency): number => {
  switch (currency) {
    case Currency.BTC:
      return 8
    default:
      return 2
  }
}
