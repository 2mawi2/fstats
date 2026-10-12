'use client'

import { Box, Typography } from '@mui/material'

import type { Transaction } from '@/types'
import type { Currency } from '@/types-enums'
import { MISC } from '@/common'
import { useIsDarkMode, useUserPreferences } from '@/hooks'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getProfitLossColors, getStats } from '@/utils/Stats'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import { ui } from './styled'

type StatsListProps = {
  transactions: Transaction[]
  currency: Currency
  /**
   * Large for totals, small for the stats of a single file.
   */
  size?: 'large' | 'small'
}

const Component = ({ transactions, currency, size = 'small' }: StatsListProps) => {
  const sx = ui(size)
  const { t } = useTranslation()
  const { locale } = useUserPreferences()
  const isDarkMode = useIsDarkMode()
  const { totalIncome, totalExpense, profit, profitMargin } = getStats(transactions)
  const { incomeTextColor, expensesTextColor, profitTextColor } = getProfitLossColors(Big(profit).gte(0), isDarkMode)

  const amounts = [
    { label: t('MISC.INCOME'), value: toFixedLocaleCurrency(totalIncome, currency, locale), color: incomeTextColor },
    {
      label: t('MISC.EXPENSES'),
      value: toFixedLocaleCurrency(totalExpense, currency, locale),
      color: expensesTextColor,
    },
  ]

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="div">
        {t('MISC.BALANCE')}
      </Typography>
      <Typography sx={{ ...sx.balance, color: profitTextColor }}>
        {toFixedLocaleCurrency(profit, currency, locale)}
      </Typography>
      <Box sx={sx.amounts}>
        {amounts.map((amount) => (
          <Box key={amount.label} sx={sx.amount}>
            <Typography variant="caption" color="text.secondary" component="div">
              {amount.label}
            </Typography>
            <Typography variant="body2" sx={{ ...sx.amountValue, color: amount.color }}>
              {amount.value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary" component="div" sx={sx.meta}>
        {t('DATA_PAGE.TRANSACTION_COUNT', { count: transactions.length })} {MISC.CENTER_DOT} {t('MISC.PROFIT_MARGIN')}{' '}
        {toFixedLocale(profitMargin, 1, locale, { trimTrailingZeros: true })}%
      </Typography>
    </Box>
  )
}

export default Component
