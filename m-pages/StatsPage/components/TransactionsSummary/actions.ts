import { groupBy } from 'lodash'

import type { ParsedStatsFile } from '@/types'
import type { Currency } from '@/types-enums'
import { getFileCurrency, getFileTransactions, splitDuplicates } from '@/m-stats-file/service'

import { filterDays, getTransactionCounts } from '../../actions'

/**
 * Transactions of the files (before the date explorer) without duplicates and those on deselected days, grouped by
 * currency, as amounts in different currencies can't be summed up.
 */
export const getTransactionsByCurrency = (files: ParsedStatsFile[], deselectedDays: Set<string>) => {
  return Object.entries(groupBy(files, getFileCurrency)).map(([currency, currencyFiles]) => {
    const transactions = currencyFiles.flatMap(getFileTransactions)

    return {
      currency: currency as Currency,
      transactions: filterDays(splitDuplicates(transactions).unique, deselectedDays),
      counts: getTransactionCounts(transactions, deselectedDays),
    }
  })
}
