'use client'

import { Box, Typography } from '@mui/material'

import type { ParsedStatsFile } from '@/types'
import { useTranslation } from '@/lib/i18n'

import StatsList from '../StatsList'
import { getTransactionsByCurrency } from './actions'
import { ui } from './styled'

type TransactionsSummaryProps = {
  files: ParsedStatsFile[]
}

/**
 * Combined stats of all files, one card per currency.
 */
const Component = ({ files }: TransactionsSummaryProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const groups = getTransactionsByCurrency(files)

  return (
    <Box component="section" sx={sx.section}>
      <Typography variant="overline" color="text.secondary" component="h2" sx={sx.heading}>
        {t('DATA_PAGE.ALL_TRANSACTIONS')}
      </Typography>
      {groups.map(({ currency, transactions, duplicateCount }) => (
        <Box key={currency} sx={sx.card}>
          {groups.length > 1 ? (
            <Typography variant="body2" sx={sx.currency}>
              {currency}
            </Typography>
          ) : null}
          <StatsList transactions={transactions} currency={currency} size="large" />
          {duplicateCount ? (
            <Typography variant="caption" color="text.secondary" component="div" sx={sx.duplicates}>
              {t('DATA_PAGE.DUPLICATES_EXCLUDED', { count: duplicateCount })}
            </Typography>
          ) : null}
        </Box>
      ))}
      <Typography variant="overline" color="text.secondary" component="h2" sx={sx.heading}>
        {t('DATA_PAGE.PER_FILE')}
      </Typography>
    </Box>
  )
}

export default Component
