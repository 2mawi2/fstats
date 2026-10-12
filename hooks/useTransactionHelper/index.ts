'use client'

import { parseISO } from 'date-fns'

import { ParsedStatsFile, Transaction, TransactionRangeItem } from '@/types'
import { DateFormat, UserLocale } from '@/types-enums'
import { DEMO_TRANSACTIONS } from '@/common'
import { splitDuplicates } from '@/m-stats-file/service'

import { getTransactionsGroupedByDay } from './helper'

export const useTransactionHelper = ({
  isDemoMode,
  files,
  locale,
  dateFormat,
}: {
  isDemoMode: boolean
  files: ParsedStatsFile[]
  locale: UserLocale
  dateFormat: DateFormat
}): {
  transactions: Transaction[]
  duplicates: Transaction[]
  transactionRangeItems: TransactionRangeItem[]
} => {
  let allTransactions: Transaction[] = []

  if (isDemoMode) {
    allTransactions = DEMO_TRANSACTIONS
  } else {
    allTransactions = files.flatMap((file) => file.sections).flatMap((section) => section.transactions)
  }

  if (!allTransactions.length) {
    return {
      transactions: [],
      duplicates: [],
      transactionRangeItems: [],
    }
  }

  const { unique: transactions, duplicates } = splitDuplicates(allTransactions)
  transactions.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
  const transactionRangeItems = getTransactionsGroupedByDay({
    dateRange: {
      start: parseISO(transactions[0].date),
      end: parseISO(transactions[transactions.length - 1].date),
    },
    transactions,
    locale,
    dateFormat,
  })

  return {
    transactions,
    duplicates,
    transactionRangeItems,
  }
}
