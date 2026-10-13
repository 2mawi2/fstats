'use client'

import { Box } from '@mui/material'

import type { Transaction } from '@/types'
import { LineChart } from '@/components'
import { useIsDarkMode, useUserPreferences } from '@/hooks'
import { getAreaFill, getThemeColor } from '@/utils/Chart'
import { useTranslation } from '@/lib/i18n'

import CardTitle from '../CardTitle'
import { getChartOptions, getLineColors, getMonthlyCounts } from './actions'
import { ui } from './styled'

type TransactionCountChartProps = {
  /**
   * Filtered and sorted by date.
   */
  transactions: Transaction[]
  /**
   * Days deselected in the date explorer, months without other transactions are gaps.
   */
  excludedDays: Set<string>
}

/**
 * Number of transactions per month.
 */
const Component = ({ transactions, excludedDays }: TransactionCountChartProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const isDarkMode = useIsDarkMode()
  const { locale, dateFormat } = useUserPreferences()
  const { labels, counts, average } = getMonthlyCounts({ transactions, excludedDays, locale, dateFormat })
  const colors = getLineColors(isDarkMode)

  const chartData = {
    labels,
    datasets: [
      {
        label: t('MISC.TRANSACTIONS'),
        data: counts,
        borderColor: colors.count,
        backgroundColor: getAreaFill(colors.count),
        fill: 'origin',
        borderWidth: 2,
        // Smooth, without overshooting the counts
        cubicInterpolationMode: 'monotone' as const,
        // Hollow points, ringed by the surface
        pointBackgroundColor: () => getThemeColor('--mui-palette-background-paper'),
        pointBorderColor: colors.count,
      },
    ],
  }

  return (
    <Box>
      <CardTitle caption={t('MISC.TRANSACTION_COUNT', { count: transactions.length })}>
        {t('STATS_PAGE.STATS_VIEW.TRANSACTIONS_PER_MONTH')}
      </CardTitle>
      <Box sx={sx.chartCard}>
        <LineChart
          type="line"
          options={getChartOptions({
            average,
            averageLabel: t('STATS_PAGE.STATS_VIEW.AVERAGE_PER_MONTH', {
              average: (average ?? 0).toLocaleString(locale),
            }),
            colors,
          })}
          data={chartData}
        />
      </Box>
    </Box>
  )
}

export default Component
