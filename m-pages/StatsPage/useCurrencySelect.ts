'use client'

import { useLocalStorage } from 'usehooks-ts'

import type { Currency } from '@/types-enums'
import { MISC } from '@/common'

export const ALL_CURRENCIES = 'all'

export type SelectedCurrency = Currency | typeof ALL_CURRENCIES

/**
 * Selected currency of the breakdown and stats views, shared by both. All currencies when the stored one isn't among
 * `currencies` (e.g. its files were unchecked).
 */
export const useCurrencySelect = (currencies: Currency[]) => {
  const [storedCurrency, setSelected] = useLocalStorage<SelectedCurrency>(MISC.LS_DATA_CURRENCY_KEY, ALL_CURRENCIES, {
    initializeWithValue: false,
  })
  const selected = currencies.includes(storedCurrency as Currency) ? storedCurrency : ALL_CURRENCIES

  return {
    selected,
    setSelected,
    shownCurrencies: selected === ALL_CURRENCIES ? currencies : [selected],
  }
}
