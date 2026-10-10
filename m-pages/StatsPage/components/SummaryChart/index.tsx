import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ScriptableContext } from 'chart.js'

import type { TransactionRangeItem } from '@/types'
import { LineChart } from '@/components'
import { useIsDarkMode } from '@/hooks'
import { getGradient } from '@/utils/Chart'

import { accumulateValues, getChartColors, getChartOptions } from './actions'
import { ui } from './styled'

type SummaryChartProps = {
  transactionRangeItems: TransactionRangeItem[]
}

const Component = ({ transactionRangeItems }: SummaryChartProps) => {
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui()
  const chartOptions = getChartOptions(theme)
  const chartColors = getChartColors(isDarkMode)
  const labels = transactionRangeItems.map(({ label }) => label)
  const income = accumulateValues(transactionRangeItems, 'income')
  const expenses = accumulateValues(transactionRangeItems, 'expenses')
  const both = accumulateValues(transactionRangeItems, 'both')

  // Add a "zero" data entry so the chart always begins from zero
  labels.unshift('')
  income.unshift(0)
  expenses.unshift(0)
  both.unshift(0)

  const chartData = {
    labels,
    datasets: [
      // {
      //   label: 'Income',
      //   data: income,
      //   borderColor: (context: ScriptableContext<'line'>) => getGradient({ context, colors: chartColors.income }),
      //   lineTension: 0.1,
      //   borderWidth: 1,
      // },
      // {
      //   label: 'Expenses',
      //   data: expenses,
      //   borderColor: (context: ScriptableContext<'line'>) => getGradient({ context, colors: chartColors.expenses }),
      //   lineTension: 0.1,
      //   borderWidth: 1,
      // },
      {
        label: 'Balance',
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
      {transactionRangeItems.length ? (
        <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
          {transactionRangeItems[0].label} - {transactionRangeItems[transactionRangeItems.length - 1].label}
        </Typography>
      ) : null}
      <Box sx={sx.chartCard}>
        <LineChart type="line" options={chartOptions} data={chartData} />
      </Box>
    </Box>
  )
}

export default Component
