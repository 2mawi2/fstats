'use client'

import type { ParsedStatsFile } from '@/types'
import { useTranslation } from '@/lib/i18n'

import StatsRow from '../StatsRow'
import { getTransactionsByCurrency } from './actions'

type TransactionsSummaryProps = {
  files: ParsedStatsFile[]
  includeDuplicates: boolean
  /**
   * Before the date explorer, see `useShownFiles`.
   */
  allFiles: ParsedStatsFile[]
}

/**
 * Combined stats of all files, one row per currency.
 */
const Component = ({ files, allFiles, includeDuplicates }: TransactionsSummaryProps) => {
  const { t } = useTranslation()
  const groups = getTransactionsByCurrency(files, allFiles, includeDuplicates)

  return groups.map(({ currency, transactions, duplicateCount, dateExcludedCount }) => (
    <StatsRow
      key={currency}
      title={t('MISC.ALL_TRANSACTIONS')}
      chip={groups.length > 1 ? currency : undefined}
      isTotal
      defaultExpanded
      stats={{ transactions, currency }}
      dateExcludedCount={dateExcludedCount}
      notes={
        duplicateCount
          ? [
              t(
                includeDuplicates ? 'STATS_PAGE.SIDEBAR.DUPLICATES_INCLUDED' : 'STATS_PAGE.SIDEBAR.DUPLICATES_EXCLUDED',
                { count: duplicateCount },
              ),
            ]
          : []
      }
    />
  ))
}

export default Component
