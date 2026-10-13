'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'

import { AmountFilter } from './actions'

/**
 * All, in or out transactions, shared by the transactions and stats views.
 */
export const useAmountFilter = () => {
  return useLocalStorage<AmountFilter>(MISC.LS_DATA_AMOUNT_FILTER_KEY, AmountFilter.ALL, {
    initializeWithValue: false,
  })
}
