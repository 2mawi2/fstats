'use client'

import { useLocalStorage } from 'usehooks-ts'

import { MISC } from '@/common'

import { BreakdownPeriod } from './components/ProfitLossView/actions'

/**
 * Period of the profit and loss columns.
 */
export const useBreakdownPeriod = () => {
  const [period, setPeriod] = useLocalStorage<BreakdownPeriod>(
    MISC.LS_STATS_BREAKDOWN_PERIOD_KEY,
    BreakdownPeriod.MONTH,
    { initializeWithValue: false },
  )

  return { period, setPeriod }
}
