'use client'

import { Box, Typography } from '@mui/material'

import type { Transaction } from '@/types'
import type { Currency } from '@/types-enums'
import { MISC } from '@/common'
import { useUserPreferences } from '@/hooks'
import { toFixedLocaleCurrency } from '@/utils/Number'
import { getStats } from '@/utils/Stats'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import { getAmountColor } from '../../actions'
import { ui } from './styled'

type StatsListProps = {
  transactions: Transaction[]
  currency: Currency
  /**
   * Shown after the transaction count.
   */
  notes?: string[]
}

/**
 * Income minus expenses with the total below, like a ledger.
 */
const Component = ({ transactions, currency, notes = [] }: StatsListProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const { locale } = useUserPreferences()
  const { totalIncome, totalExpense, profit } = getStats(transactions)

  const items = [
    { label: t('MISC.INCOME'), value: totalIncome },
    { label: t('MISC.EXPENSES'), value: Big(totalExpense).times(-1).toString() },
  ]

  return (
    <Box>
      <Typography component="div" sx={sx.count}>
        {[t('MISC.TRANSACTION_COUNT', { count: transactions.length }), ...notes].join(` ${MISC.CENTER_DOT} `)}
      </Typography>
      <Box component="dl" sx={sx.list}>
        {items.map((item) => (
          <Box key={item.label} sx={sx.row}>
            <Typography component="dt" sx={sx.label}>
              {item.label}
            </Typography>
            <Typography component="dd" sx={{ ...sx.value, color: getAmountColor(item.value) }}>
              {toFixedLocaleCurrency(item.value, currency, locale)}
            </Typography>
          </Box>
        ))}
        <Box sx={{ ...sx.row, ...sx.totalRow }}>
          <Typography component="dt" sx={{ ...sx.label, ...sx.total }}>
            {t('MISC.TOTAL')}
          </Typography>
          <Typography component="dd" sx={{ ...sx.value, ...sx.total, color: getAmountColor(profit) }}>
            {toFixedLocaleCurrency(profit, currency, locale)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Component
