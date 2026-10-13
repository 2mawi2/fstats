'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'

import { TransactionsLayout } from './actions'

/**
 * Display options of the transactions table: the layout of multiple files, and whether duplicates and transactions on
 * deselected days are shown (greyed out). Display only, they are never counted.
 */
export const useTableOptions = () => {
  const [transactionsLayout, setTransactionsLayout] = useLocalStorage<TransactionsLayout>(
    MISC.LS_STATS_TRANSACTIONS_LAYOUT_KEY,
    TransactionsLayout.COMBINED,
    { initializeWithValue: false },
  )
  const [includeDuplicates, setIncludeDuplicates] = useLocalStorage(MISC.LS_STATS_INCLUDE_DUPLICATES_KEY, false, {
    initializeWithValue: false,
  })
  const [includeDateExcluded, setIncludeDateExcluded] = useLocalStorage(
    MISC.LS_STATS_INCLUDE_DATE_EXCLUDED_KEY,
    false,
    { initializeWithValue: false },
  )

  return {
    transactionsLayout,
    setTransactionsLayout,
    includeDuplicates,
    setIncludeDuplicates,
    includeDateExcluded,
    setIncludeDateExcluded,
  }
}
