'use client'

import { parseISO } from 'date-fns'
import { difference, uniqBy } from 'lodash'

import { ParsedStatsFile, SelectOptionBankAccountId, Transaction, TransactionRangeItem } from '@/types'
import { DateFormat, UserLocale } from '@/types-enums'
import { DEMO_TRANSACTIONS } from '@/common'
import { getBankAccountId } from '@/utils/Parser'

import { getTransactionsGroupedByDay } from './helper'

export const useTransactionHelper = ({
  isDemoMode,
  selectedId,
  files,
  locale,
  dateFormat,
}: {
  isDemoMode: boolean
  selectedId: SelectOptionBankAccountId
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
    const filesForSelectedId =
      selectedId === 'all' ? files : files.filter((file) => getBankAccountId(file.parserId) === selectedId)
    allTransactions = filesForSelectedId.flatMap((file) => file.transactions)
  }

  if (!allTransactions.length) {
    return {
      transactions: [],
      duplicates: [],
      transactionRangeItems: [],
    }
  }

  // IDs are content hashes, so this removes identical transactions (e.g. from overlapping statements)
  const transactions = uniqBy(allTransactions, 'id')
  const duplicates = difference(allTransactions, transactions)
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
