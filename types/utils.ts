import type { SvgIconComponent } from '@mui/icons-material'
import type { Locale } from 'date-fns'

import type { DateRange } from './global'
import type { CategoryCode, Transaction } from './services/transaction'

export type DateFnsLocale = Locale

export type Size = {
  width?: number
  height?: number
}

export type TransactionRangeItem = {
  range: DateRange
  label: string
  transactions: Transaction[]
}

export type FixedLocaleOptions = {
  trimTrailingZeros?: boolean
}

export type FixedLocaleAmountOptions = FixedLocaleOptions & {
  showPlusSign?: boolean
}

export type KeywordRule = {
  keywords: string[]
  category: CategoryCode
}

export type NavItem = {
  route: string
  labelKey: string
  icon: SvgIconComponent
  iconActive: SvgIconComponent
  isExternal?: boolean
}

export type SortingPref = 'asc' | 'desc' | 'totalAsc' | 'totalDesc'
