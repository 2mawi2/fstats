import { parseISO } from 'date-fns'

import { ParsedStatsFile, Transaction, TransactionRangeItem } from '@/types'
import { DateFormat, UserLocale } from '@/types-enums'
import { splitDuplicates } from '@/m-stats-file/service'

import { getTransactionRangeItems, getTransactionsDateRange } from './helper'

export { getTransactionRangeItems, getTransactionsDateRange, RangeGranularity } from './helper'

export const getTransactionHelper = ({
  files,
  locale,
  dateFormat,
  filterTransactions = (transactions) => transactions,
  excludedDays,
}: {
  files: ParsedStatsFile[]
  locale: UserLocale
  dateFormat: DateFormat
  /**
   * Applied to the unique transactions, before the range items are grouped.
   */
  filterTransactions?: (transactions: Transaction[]) => Transaction[]
  /**
   * Days (`yyyy-MM-dd`) whose transactions were removed from `files`, shown as gaps.
   */
  excludedDays?: Set<string>
}): {
  transactions: Transaction[]
  transactionRangeItems: TransactionRangeItem[]
} => {
  const allTransactions = files.flatMap((file) => file.sections).flatMap((section) => section.transactions)
  const transactions = filterTransactions(splitDuplicates(allTransactions).unique)

  if (!transactions.length) {
    return {
      transactions: [],
      transactionRangeItems: [],
    }
  }

  transactions.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
  const transactionRangeItems = getTransactionRangeItems({
    dateRange: getTransactionsDateRange(transactions),
    transactions,
    locale,
    dateFormat,
    excludedDays,
  })

  return {
    transactions,
    transactionRangeItems,
  }
}
