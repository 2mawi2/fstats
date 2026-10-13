'use client'

import type { Currency } from '@/types-enums'
import { MISC } from '@/common'

import { useViewStorage } from './useViewStorage'

export const ALL_CURRENCIES = 'all'

export type SelectedCurrency = Currency | typeof ALL_CURRENCIES

/**
 * Selected currency, shared by the views. All currencies when the stored one isn't among `currencies` (e.g. its files
 * were unchecked). Kept separately in demo mode, see `useViewStorage`.
 */
export const useCurrencySelect = (currencies: Currency[]) => {
  const [storedCurrency, setSelected] = useViewStorage<SelectedCurrency>(MISC.LS_STATS_CURRENCY_KEY, ALL_CURRENCIES)
  const selected = currencies.includes(storedCurrency as Currency) ? storedCurrency : ALL_CURRENCIES

  return {
    selected,
    setSelected,
    shownCurrencies: selected === ALL_CURRENCIES ? currencies : [selected],
  }
}
