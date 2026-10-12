'use client'

import type { ParsedStatsFile } from '@/types'
import { useTranslation } from '@/lib/i18n'

import StatsRow from '../StatsRow'
import { getTransactionsByCurrency } from './actions'

type TransactionsSummaryProps = {
  files: ParsedStatsFile[]
  includeDuplicates: boolean
}

/**
 * Combined stats of all files, one row per currency.
 */
const Component = ({ files, includeDuplicates }: TransactionsSummaryProps) => {
  const { t } = useTranslation()
  const groups = getTransactionsByCurrency(files, includeDuplicates)

  return groups.map(({ currency, transactions, duplicateCount }) => (
    <StatsRow
      key={currency}
      title={t('DATA_PAGE.ALL_TRANSACTIONS')}
      chip={groups.length > 1 ? currency : undefined}
      isTotal
      defaultExpanded
      stats={{ transactions, currency }}
      notes={
        duplicateCount
          ? [
              t(includeDuplicates ? 'DATA_PAGE.DUPLICATES_INCLUDED' : 'DATA_PAGE.DUPLICATES_EXCLUDED', {
                count: duplicateCount,
              }),
            ]
          : []
      }
    />
  ))
}

export default Component
