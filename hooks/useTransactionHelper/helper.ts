import { formatISO } from 'date-fns'

import type { DateRange, Transaction, TransactionRangeItem } from '@/types'
import { DateFormat, UserLocale } from '@/types-enums'
import { getDaysInRange, toDisplayDate } from '@/utils/Date'

/**
 * One item per day in the range (including days without transactions).
 */
export const getTransactionsGroupedByDay = ({
  dateRange,
  transactions,
  locale,
  dateFormat,
}: {
  dateRange: DateRange
  transactions: Transaction[]
  locale: UserLocale
  dateFormat: DateFormat
}): TransactionRangeItem[] => {
  const transactionsByDay = new Map<string, Transaction[]>()

  transactions.forEach((transaction) => {
    const day = transaction.date.split('T')[0]
    const dayTransactions = transactionsByDay.get(day)
    if (dayTransactions) {
      dayTransactions.push(transaction)
    } else {
      transactionsByDay.set(day, [transaction])
    }
  })

  return getDaysInRange(dateRange).map((day) => ({
    range: { start: day, end: day },
    label: toDisplayDate(day, locale, { formatTo: dateFormat }),
    transactions: transactionsByDay.get(formatISO(day).split('T')[0]) ?? [],
  }))
}
