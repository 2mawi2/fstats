import type { SvgIconComponent } from '@mui/icons-material'
import type { Locale } from 'date-fns'

import { Currency } from '@/types-enums'
import type { BankAccountId } from '@/utils/Parser/registry'

import type { DateRange, NumberString, SelectOptionWithType } from './global'
import type { CategoryCode, Transaction } from './services/transaction'

export type DateFnsLocale = Locale

export type FeatureFlags = Record<string, boolean>

export type Size = {
  width?: number
  height?: number
}

export type SelectOptionBankAccountId = BankAccountId | 'all' | ''

export type BankSelectOption = SelectOptionWithType<SelectOptionBankAccountId>

export type GroupDataByOption = 'day' | 'week' | 'month' | 'year' // TODO: Add 'quarter'

export type StatsPageForm = {
  selectedId: BankSelectOption['value']
  groupDataBy: GroupDataByOption
  includeEmptyRangeItems: boolean
}

export type TransactionRangeItem = {
  range: DateRange
  label: string
  transactions: Transaction[]
}

/**
 * The currency format to use when formatting a currency, iso refers to "ISO 4217".
 */
export type CurrencyFormat = 'iso' | 'symbol'

export type FixedLocaleAppendOption =
  | string
  | {
      currency: Currency
      format?: CurrencyFormat
    }
  | null

export type FixedLocaleOptions = {
  trimTrailingZeros?: boolean
  append?: FixedLocaleAppendOption
  prepend?: FixedLocaleAppendOption
}

export type FixedLocaleCurrencyOptions = {
  rawValue?: NumberString
  isFractional?: boolean
  currencyFormat?: CurrencyFormat
  trimTrailingZeros?: boolean
}

export type KeywordRule = {
  keywords: string[]
  category: CategoryCode
}

export type NavItem = {
  route: string
  labelKey: string
  icon: SvgIconComponent
}

export type SortingPref = 'asc' | 'desc' | 'totalAsc' | 'totalDesc'
