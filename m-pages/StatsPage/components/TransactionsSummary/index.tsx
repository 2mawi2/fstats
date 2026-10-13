'use client'

import type { ParsedStatsFile } from '@/types'
import { useTranslation } from '@/lib/i18n'

import StatsRow from '../StatsRow'
import { getTransactionsByCurrency } from './actions'

type TransactionsSummaryProps = {
  /**
   * Before the date explorer, see `useShownFiles`.
   */
  files: ParsedStatsFile[]
  deselectedDays: Set<string>
}

/**
 * Combined stats of all files, one row per currency.
 */
const Component = ({ files, deselectedDays }: TransactionsSummaryProps) => {
  const { t } = useTranslation()
  const groups = getTransactionsByCurrency(files, deselectedDays)

  return groups.map(({ currency, transactions, counts }) => (
    <StatsRow
      key={currency}
      title={t('MISC.ALL_TRANSACTIONS')}
      chip={groups.length > 1 ? currency : undefined}
      isTotal
      defaultExpanded
      stats={{ transactions, currency }}
      counts={counts}
    />
  ))
}

export default Component
