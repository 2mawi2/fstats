'use client'

import type { ParsedStatsFile } from '@/types'
import { useTranslation } from '@/lib/i18n'

import StatsRow from '../StatsRow'
import { getTransactionsByCurrency } from './actions'

type TransactionsSummaryProps = {
  files: ParsedStatsFile[]
  includeDuplicates: boolean
  deselectedDays: Set<string>
}

/**
 * Combined stats of all files, one row per currency.
 */
const Component = ({ files, includeDuplicates, deselectedDays }: TransactionsSummaryProps) => {
  const { t } = useTranslation()
  const groups = getTransactionsByCurrency(files, includeDuplicates, deselectedDays)

  return groups.map(({ currency, transactions, duplicateCount, dateExcludedCount }) => (
    <StatsRow
      key={currency}
      title={t('MISC.ALL_TRANSACTIONS')}
      chip={groups.length > 1 ? currency : undefined}
      isTotal
      defaultExpanded
      stats={{ transactions, currency }}
      isDateFiltered={dateExcludedCount > 0}
      notes={[
        ...(dateExcludedCount ? [t('STATS_PAGE.SIDEBAR.DATE_EXCLUDED', { count: dateExcludedCount })] : []),
        ...(duplicateCount
          ? [
              t(
                includeDuplicates ? 'STATS_PAGE.SIDEBAR.DUPLICATES_INCLUDED' : 'STATS_PAGE.SIDEBAR.DUPLICATES_EXCLUDED',
                {
                  count: duplicateCount,
                },
              ),
            ]
          : []),
      ]}
    />
  ))
}

export default Component
