'use client'

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'

import type { TransactionFilter } from './actions'
import { AmountFilter } from './actions'

/**
 * Amount and category filter, shared by the transactions, breakdown and stats views. Excluded rather than included
 * categories are stored, so categories of newly added files are shown.
 */
export const useTransactionFilter = () => {
  const [amountFilter, setAmountFilter] = useLocalStorage<AmountFilter>(
    MISC.LS_DATA_AMOUNT_FILTER_KEY,
    AmountFilter.ALL,
    { initializeWithValue: false },
  )
  const [storedCategories, setStoredCategories] = useLocalStorage<string[]>(MISC.LS_DATA_EXCLUDED_CATEGORIES_KEY, [], {
    initializeWithValue: false,
  })
  const excludedCategories = useMemo(() => new Set(storedCategories), [storedCategories])
  const setExcludedCategories = useCallback(
    (categories: Set<string>) => setStoredCategories([...categories]),
    [setStoredCategories],
  )
  const filter: TransactionFilter = useMemo(
    () => ({ amount: amountFilter, excludedCategories }),
    [amountFilter, excludedCategories],
  )

  return { filter, amountFilter, setAmountFilter, excludedCategories, setExcludedCategories }
}
