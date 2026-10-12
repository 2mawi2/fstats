import { groupBy } from 'lodash'

import type { ParsedStatsFile } from '@/types'
import type { Currency } from '@/types-enums'
import { getFileCurrency, getFileTransactions, splitDuplicates } from '@/m-stats-file/service'

/**
 * Transactions of all files, optionally without duplicates, grouped by currency, as amounts in different currencies can't be summed
 * up.
 */
export const getTransactionsByCurrency = (files: ParsedStatsFile[], includeDuplicates: boolean) => {
  return Object.entries(groupBy(files, getFileCurrency)).map(([currency, currencyFiles]) => {
    const allTransactions = currencyFiles.flatMap(getFileTransactions)
    const { unique, duplicates } = splitDuplicates(allTransactions)

    return {
      currency: currency as Currency,
      transactions: includeDuplicates ? allTransactions : unique,
      duplicateCount: duplicates.length,
    }
  })
}
