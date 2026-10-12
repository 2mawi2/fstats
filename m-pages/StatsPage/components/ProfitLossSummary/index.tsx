'use client'

import { Box, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import type { Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { useIsDarkMode, useUserPreferences } from '@/hooks'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getProfitLossColors, getStats } from '@/utils/Stats'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import { ui } from './styled'

type ProfitLossSummaryProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: ProfitLossSummaryProps) => {
  const { t } = useTranslation()
  const { locale } = useUserPreferences()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme)
  const { totalIncome, totalExpense, profit, profitMargin } = getStats(transactions)
  const totalIncomeDisplay = toFixedLocaleCurrency(totalIncome, currency, locale)
  const totalExpenseDisplay = toFixedLocaleCurrency(totalExpense, currency, locale)
  const profitDisplay = toFixedLocaleCurrency(profit, currency, locale)
  const profitMarginDisplay = toFixedLocale(profitMargin, 1, locale, { trimTrailingZeros: true })
  const { incomeTextColor, expensesTextColor, profitTextColor, profitBgColor } = getProfitLossColors(
    Big(profit).gte(0),
    isDarkMode,
  )

  const cards = [
    { label: t('MISC.INCOME'), value: totalIncomeDisplay, color: incomeTextColor, md: 3.25, highlight: false },
    { label: t('MISC.EXPENSES'), value: totalExpenseDisplay, color: expensesTextColor, md: 3.25, highlight: false },
    { label: t('MISC.BALANCE'), value: profitDisplay, color: profitTextColor, md: 3.25, highlight: true },
    {
      label: t('MISC.PROFIT_MARGIN'),
      value: `${profitMarginDisplay}%`,
      color: profitTextColor,
      md: 2.25,
      highlight: true,
    },
  ]

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        {cards.map(({ label, value, color, md, highlight }) => (
          <Grid key={label} size={{ xs: 12, md }}>
            <Box sx={highlight ? sx.profitCard(profitBgColor) : sx.statCard('transparent')}>
              <Box sx={sx.statHeader}>
                <Typography variant="caption" sx={sx.caption(color)}>
                  {label}
                </Typography>
              </Box>
              <Typography variant="h4" sx={sx.amount(color)}>
                {value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Component
