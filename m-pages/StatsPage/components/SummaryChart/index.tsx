import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ScriptableContext } from 'chart.js'

import type { TransactionRangeItem } from '@/types'
import { LineChart } from '@/components'
import { useIsDarkMode } from '@/hooks'
import { getGradient } from '@/utils/Chart'
import { useTranslation } from '@/lib/i18n'

import CardTitle from '../CardTitle'
import { accumulateValues, getChartColors, getChartOptions } from './actions'
import { ui } from './styled'

type SummaryChartProps = {
  transactionRangeItems: TransactionRangeItem[]
}

const Component = ({ transactionRangeItems }: SummaryChartProps) => {
  const { t } = useTranslation()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui()
  const chartOptions = getChartOptions(theme)
  const chartColors = getChartColors(isDarkMode)
  const labels = transactionRangeItems.map(({ label }) => label)
  const both = accumulateValues(transactionRangeItems)

  // Add a "zero" data entry so the chart always begins from zero
  labels.unshift('')
  both.unshift(0)

  const chartData = {
    labels,
    datasets: [
      {
        label: t('MISC.BALANCE'),
        data: both,
        borderColor: (context: ScriptableContext<'line'>) => getGradient({ context, colors: chartColors.both }),
        // backgroundColor: (context: ScriptableContext<'line'>) => {
        //   return getGradient({ context, colors: chartColors.both })
        // },
        // fill: true,
        lineTension: 0.1,
        borderWidth: 2,
      },
    ],
  }

  return (
    <Box>
      <CardTitle
        caption={
          transactionRangeItems.length
            ? t('STATS_PAGE.DATE_RANGE', {
                start: transactionRangeItems[0].label,
                end: transactionRangeItems[transactionRangeItems.length - 1].label,
              })
            : null
        }
      >
        {t('STATS_PAGE.AT_A_GLANCE')}
      </CardTitle>
      <Box sx={sx.chartCard}>
        <LineChart type="line" options={chartOptions} data={chartData} />
      </Box>
    </Box>
  )
}

export default Component
