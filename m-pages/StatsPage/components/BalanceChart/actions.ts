import type { ChartOptions } from 'chart.js'

import type { TransactionRangeItem } from '@/types'
import { getBaseChartOptions, getThemeColor } from '@/utils/Chart'
import { Big } from '@/lib/w-big'

export const getChartOptions = (): ChartOptions<'line'> => {
  return getBaseChartOptions<'line'>({
    plugins: {
      // A single series, the tooltip names it
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    elements: {
      // Points only on hover, hollow like the transactions per month chart
      point: {
        radius: 0,
        hoverRadius: 4,
        hoverBorderWidth: 2,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: true,
        },
      },
      y: {
        grid: {
          display: true,
          color: (ctx) => {
            return ctx.tick.value === 0 ? getThemeColor('--mui-palette-divider') : 'transparent'
          },
        },
        ticks: {
          display: true,
        },
        afterBuildTicks: (scale) => {
          scale.ticks.push({ value: 0 })
        },
      },
    },
  })
}

/**
 * Running balance, `null` (a gap in the line) for items excluded by date.
 */
export const accumulateValues = (transactionRangeItems: TransactionRangeItem[]): (number | null)[] => {
  let total = Big(0)

  return transactionRangeItems.map((item) => {
    total = item.transactions.reduce((acc, transaction) => acc.add(transaction.value), total)
    return item.isExcluded ? null : total.toNumber()
  })
}
