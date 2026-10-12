import type { TFunction } from 'i18next'

import type { ParsedStatsFile, Transaction } from '@/types'
import { getCurrencySymbol } from '@/utils/Currency'
import { getParserCurrency } from '@/utils/Parser'
import { Big } from '@/lib/w-big'

import { AmountFilter } from '../../actions'
import type { VirtualTableColumn } from '../VirtualTable'

// Equal width digits, so numbers align across rows
const TABULAR_NUMS = { fontVariantNumeric: 'tabular-nums' } as const

export const getTransactionColumns = (
  file: ParsedStatsFile,
  amountFilter: AmountFilter,
  incomeColor: string,
  t: TFunction,
): VirtualTableColumn[] => [
  { label: t('MISC.DATE'), width: 100, getStyle: () => TABULAR_NUMS },
  { label: t('MISC.DESCRIPTION'), width: 320 },
  {
    label: t('MISC.AMOUNT_WITH_CURRENCY', { currency: getCurrencySymbol(getParserCurrency(file.parserId)) }),
    width: 120,
    align: 'right',
    // Only highlight money in when both directions are shown
    getStyle: (value) =>
      amountFilter === AmountFilter.ALL && value.startsWith('+')
        ? { ...TABULAR_NUMS, color: incomeColor, fontWeight: 600 }
        : TABULAR_NUMS,
  },
  { label: t('MISC.CATEGORY'), width: 160 },
]

export const filterTransactions = (transactions: Transaction[], filter: AmountFilter) => {
  switch (filter) {
    case AmountFilter.IN:
      return transactions.filter((transaction) => Big(transaction.value).gt(0))
    case AmountFilter.OUT:
      return transactions.filter((transaction) => Big(transaction.value).lt(0))
    default:
      return transactions
  }
}
