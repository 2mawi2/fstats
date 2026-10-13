'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'

/**
 * Whether the transactions table shows duplicates and transactions on deselected days (greyed out). Display only, they
 * are never counted.
 */
export const useTableOptions = () => {
  const [includeDuplicates, setIncludeDuplicates] = useLocalStorage(MISC.LS_STATS_INCLUDE_DUPLICATES_KEY, false, {
    initializeWithValue: false,
  })
  const [includeDateExcluded, setIncludeDateExcluded] = useLocalStorage(
    MISC.LS_STATS_INCLUDE_DATE_EXCLUDED_KEY,
    false,
    {
      initializeWithValue: false,
    },
  )

  return { includeDuplicates, setIncludeDuplicates, includeDateExcluded, setIncludeDateExcluded }
}
