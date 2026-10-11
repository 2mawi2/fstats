'use client'

import { Box, Typography } from '@mui/material'

import type { ParsedStatsFile } from '@/types'
import { useUserPreferences } from '@/hooks'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getStats } from '@/utils/Stats'
import { Big } from '@/lib/w-big'

import { ui } from './styled'

type FileStatsProps = {
  file: ParsedStatsFile
}

const Component = ({ file }: FileStatsProps) => {
  const sx = ui()
  const { locale } = useUserPreferences()
  const { transactions } = file
  const currency = transactions[0]?.currency
  const { totalIncome, totalExpense, profit, profitMargin } = getStats(transactions)
  const formatCurrency = (value: string) => (currency ? toFixedLocaleCurrency(value, currency, locale) : value)

  const stats = [
    { label: 'Transactions', value: String(transactions.length) },
    { label: 'Income', value: formatCurrency(totalIncome), color: 'success.main' },
    { label: 'Expenses', value: formatCurrency(totalExpense), color: 'error.main' },
    {
      label: 'Balance',
      value: formatCurrency(profit),
      color: Big(profit).gte(0) ? 'success.main' : 'error.main',
    },
    { label: 'Profit margin', value: `${toFixedLocale(profitMargin, 1, locale, { trimTrailingZeros: true })}%` },
  ]

  return (
    <Box component="section" sx={sx.section}>
      <Typography variant="body2" sx={sx.title}>
        {file.file.name}
      </Typography>
      <Box component="dl" sx={sx.list}>
        {stats.map((stat) => (
          <Box key={stat.label} sx={sx.row}>
            <Typography component="dt" variant="body2" color="text.secondary" sx={sx.label}>
              {stat.label}
            </Typography>
            <Typography component="dd" variant="body2" sx={{ ...sx.value, color: stat.color }}>
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Component
