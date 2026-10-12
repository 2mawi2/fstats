import type { SvgIconComponent } from '@mui/icons-material'
import type { Locale } from 'date-fns'

import type { BankAccountId } from '@/utils/Parser/registry'

import type { DateRange, SelectOptionWithType } from './global'
import type { CategoryCode, Transaction } from './services/transaction'

export type DateFnsLocale = Locale

export type Size = {
  width?: number
  height?: number
}

export type SelectOptionBankAccountId = BankAccountId | 'all' | ''

export type BankSelectOption = SelectOptionWithType<SelectOptionBankAccountId>

export type StatsPageForm = {
  selectedId: BankSelectOption['value']
}

export type TransactionRangeItem = {
  range: DateRange
  label: string
  transactions: Transaction[]
}

export type FixedLocaleOptions = {
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
