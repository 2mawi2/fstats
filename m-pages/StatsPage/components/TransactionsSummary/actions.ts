import { groupBy } from 'lodash'

import type { ParsedStatsFile } from '@/types'
import type { Currency } from '@/types-enums'
import { getFileCurrency, getFileTransactions, splitDuplicates } from '@/m-stats-file/service'

import { filterDays } from '../../actions'

/**
 * Transactions of all files on the selected days, optionally without duplicates, grouped by currency, as amounts in
 * different currencies can't be summed up.
 */
export const getTransactionsByCurrency = (
  files: ParsedStatsFile[],
  includeDuplicates: boolean,
  deselectedDays: Set<string>,
) => {
  return Object.entries(groupBy(files, getFileCurrency)).map(([currency, currencyFiles]) => {
    const fileTransactions = currencyFiles.flatMap(getFileTransactions)
    const { unique, duplicates } = splitDuplicates(fileTransactions)
    const shownTransactions = includeDuplicates ? fileTransactions : unique
    // Duplicates have the same ID, so the same day as the transaction they duplicate
    const transactions = filterDays(shownTransactions, deselectedDays)

    return {
      currency: currency as Currency,
      transactions,
      duplicateCount: filterDays(duplicates, deselectedDays).length,
      // On days deselected in the date explorer
      dateExcludedCount: shownTransactions.length - transactions.length,
    }
  })
}
