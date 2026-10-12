import { green, red } from '@mui/material/colors'
import type { ChartOptions, ScriptableContext } from 'chart.js'

import type { Transaction } from '@/types'
import { Currency, UserLocale } from '@/types-enums'
import { getBaseChartOptions, getGradient } from '@/utils/Chart'
import { toFixedLocaleCurrency } from '@/utils/Number'
import { Big } from '@/lib/w-big'

export const getBarThickness = ({ transactions, chartWidth }: { transactions: Transaction[]; chartWidth: number }) => {
  const calculatedThickness = Math.floor(chartWidth / transactions.length) / 3
  const minThickness = 1
  const maxThickness = 30

  return Math.max(minThickness, Math.min(maxThickness, calculatedThickness))
}

export const getBackgroundColour = (context: ScriptableContext<'bar'>) => {
  const value = context.parsed?.y ?? 0
  const isPositive = value >= 0

  return getGradient({
    context,
    colors: {
      start: isPositive ? green[100] : red[200],
      end: isPositive ? green[600] : red[900],
    },
    direction: 'vertical',
  })
}

export const getBorderRadius = (context: ScriptableContext<'bar'>) => {
  const value = context.parsed?.y ?? 0
  const isPositive = value >= 0

  return isPositive
    ? { topLeft: 100, topRight: 100, bottomLeft: 0, bottomRight: 0 }
    : { topLeft: 0, topRight: 0, bottomLeft: 100, bottomRight: 100 }
}

export const getChartOptions = ({
  currency,
  locale,
}: {
  currency: Currency
  locale: UserLocale
}): ChartOptions<'bar'> => {
  return getBaseChartOptions<'bar'>({
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            if (context.parsed.y !== null) {
              return toFixedLocaleCurrency(Big(context.parsed.y).toString(), currency, locale)
            }
            return context.dataset.label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback(value) {
            return toFixedLocaleCurrency(Big(value).toString(), currency, locale, { trimTrailingZeros: true })
          },
        },
      },
    },
  })
}
