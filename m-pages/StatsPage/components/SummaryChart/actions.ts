import { grey } from '@mui/material/colors'
import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import type { ChartOptions } from 'chart.js'

import type { TransactionRangeItem } from '@/types'
import { Big } from '@/lib/w-big'

export const getChartColors = (isDarkMode: boolean) => {
  return {
    both: {
      start: isDarkMode ? alpha(grey[500], 0.1) : grey[500],
      end: isDarkMode ? grey[200] : grey[900],
    },
  }
}

export const getChartOptions = (theme: Theme): ChartOptions<'line'> => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        onClick: () => {},
        labels: {
          boxHeight: 6,
          boxWidth: 6,
          useBorderRadius: true,
          borderRadius: 1,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: true,
        },
        ticks: {
          display: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          display: true,
          color: (ctx) => {
            return ctx.tick.value === 0 ? theme.palette.divider : 'transparent'
          },
        },
        ticks: {
          display: true,
          // maxTicksLimit: 3,
        },
        afterBuildTicks: (scale) => {
          scale.ticks.push({ value: 0 })
        },
      },
    },
  }
}

export const accumulateValues = (transactionRangeItems: TransactionRangeItem[]): number[] => {
  let total = Big(0)

  return transactionRangeItems.map((item) => {
    total = item.transactions.reduce((acc, transaction) => acc.add(transaction.value), total)
    return total.toNumber()
  })
}
