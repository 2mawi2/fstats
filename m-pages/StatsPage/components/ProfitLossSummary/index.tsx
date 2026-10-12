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

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3.25 }}>
          <Box sx={sx.statCard('transparent')}>
            <Box sx={sx.statHeader}>
              {/* <TrendingUp sx={{ color: incomeTextColor, fontSize: 20 }} /> */}
              <Typography variant="caption" sx={sx.caption(incomeTextColor)}>
                {t('MISC.INCOME')}
              </Typography>
            </Box>
            <Typography color="primary" variant="h4" sx={sx.amount(incomeTextColor)}>
              {totalIncomeDisplay}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3.25 }}>
          <Box sx={sx.statCard('transparent')}>
            <Box sx={sx.statHeader}>
              {/* <TrendingDown sx={{ color: expensesTextColor, fontSize: 20 }} /> */}
              <Typography variant="caption" sx={sx.caption(expensesTextColor)}>
                {t('MISC.EXPENSES')}
              </Typography>
            </Box>
            <Typography variant="h4" sx={sx.amount(expensesTextColor)}>
              {totalExpenseDisplay}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3.25 }}>
          <Box sx={sx.profitCard(profitBgColor)}>
            <Box sx={sx.statHeader}>
              <Typography variant="caption" sx={sx.caption(profitTextColor)}>
                {t('MISC.BALANCE')}
              </Typography>
            </Box>
            <Typography variant="h4" sx={sx.amount(profitTextColor)}>
              {profitDisplay}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 2.25 }}>
          <Box sx={sx.profitCard(profitBgColor)}>
            <Box sx={sx.statHeader}>
              <Typography variant="caption" sx={sx.caption(profitTextColor)}>
                {t('MISC.PROFIT_MARGIN')}
              </Typography>
            </Box>
            <Typography variant="h4" sx={sx.amount(profitTextColor)}>
              {profitMarginDisplay}%
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Component
