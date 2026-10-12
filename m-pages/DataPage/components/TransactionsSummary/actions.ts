import { groupBy } from 'lodash'

import type { ParsedStatsFile } from '@/types'
import type { Currency } from '@/types-enums'
import { getFileCurrency, getFileTransactions, getUniqueTransactions } from '@/m-stats-file/service'

/**
 * Transactions of all files without duplicates, grouped by currency, as amounts in different currencies can't be summed
 * up.
 */
export const getTransactionsByCurrency = (files: ParsedStatsFile[]) => {
  return Object.entries(groupBy(files, getFileCurrency)).map(([currency, currencyFiles]) => {
    const allTransactions = currencyFiles.flatMap(getFileTransactions)
    const transactions = getUniqueTransactions(allTransactions)

    return {
      currency: currency as Currency,
      transactions,
      duplicateCount: allTransactions.length - transactions.length,
    }
  })
}
