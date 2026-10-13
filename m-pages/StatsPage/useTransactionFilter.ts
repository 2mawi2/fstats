'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { getView, MISC, WorkspaceView } from '@/common'

import type { TransactionFilter } from './actions'
import { AmountFilter } from './actions'

const NO_CATEGORIES = new Set<string>()

/**
 * Amount and category filter, shared by the views, the filters and the sidebar. Excluded rather than included
 * categories are stored, so categories of newly added files are shown. None excluded in the CSV view, where the
 * filters don't apply.
 */
export const useTransactionFilter = () => {
  const isCsv = getView(useSearchParams()) === WorkspaceView.CSV
  const [amountFilter, setAmountFilter] = useLocalStorage<AmountFilter>(
    MISC.LS_STATS_AMOUNT_FILTER_KEY,
    AmountFilter.ALL,
    { initializeWithValue: false },
  )
  const [storedCategories, setStoredCategories] = useLocalStorage<string[]>(MISC.LS_STATS_EXCLUDED_CATEGORIES_KEY, [], {
    initializeWithValue: false,
  })
  const excludedCategories = useMemo(
    () => (isCsv ? NO_CATEGORIES : new Set(storedCategories)),
    [isCsv, storedCategories],
  )
  const setExcludedCategories = useCallback(
    (categories: Set<string>) => setStoredCategories([...categories]),
    [setStoredCategories],
  )
  const filter: TransactionFilter = useMemo(
    () => ({ amount: amountFilter, excludedCategories }),
    [amountFilter, excludedCategories],
  )
  // Where income and expenses are shown side by side (breakdown, sidebar), the amount filter doesn't apply
  const categoryFilter: TransactionFilter = useMemo(
    () => ({ amount: AmountFilter.ALL, excludedCategories }),
    [excludedCategories],
  )

  return { filter, categoryFilter, amountFilter, setAmountFilter, excludedCategories, setExcludedCategories }
}
