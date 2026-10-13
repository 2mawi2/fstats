import { groupBy } from 'lodash'

import type { ParsedStatsFile, Transaction } from '@/types'
import type { Currency } from '@/types-enums'
import { getFileCurrency, getFileTransactions, splitDuplicates } from '@/m-stats-file/service'

/**
 * Transactions of the files, optionally without duplicates, grouped by currency, as amounts in different currencies
 * can't be summed up. `allFiles` are the files before the date explorer, for the count of excluded transactions.
 */
export const getTransactionsByCurrency = (
  files: ParsedStatsFile[],
  allFiles: ParsedStatsFile[],
  includeDuplicates: boolean,
) => {
  const filesByCurrency = groupBy(files, getFileCurrency)
  const getShown = (transactions: Transaction[]) => {
    const { unique, duplicates } = splitDuplicates(transactions)
    return { transactions: includeDuplicates ? transactions : unique, duplicateCount: duplicates.length }
  }

  return Object.entries(groupBy(allFiles, getFileCurrency)).map(([currency, currencyFiles]) => {
    const all = getShown(currencyFiles.flatMap(getFileTransactions))
    const shown = getShown((filesByCurrency[currency] ?? []).flatMap(getFileTransactions))

    return {
      currency: currency as Currency,
      transactions: shown.transactions,
      duplicateCount: shown.duplicateCount,
      // On days deselected in the date explorer
      dateExcludedCount: all.transactions.length - shown.transactions.length,
    }
  })
}
