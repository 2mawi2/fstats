import type { ChartOptions, ScriptableContext } from 'chart.js'
import { merge } from 'lodash'

import type { GradientColors, GradientDirection } from '@/types'

export const getGradient = ({
  context,
  colors,
  direction = 'horizontal',
  reverse = false,
}: {
  context: ScriptableContext<'line'> | ScriptableContext<'bar'>
  colors: GradientColors
  direction?: GradientDirection
  reverse?: boolean
}): CanvasGradient | 'currentcolor' => {
  const { chart } = context
  const { ctx, chartArea } = chart

  if (!chartArea) {
    return 'currentcolor'
  }

  const hStart = reverse ? chartArea.right : chartArea.left
  const hEnd = reverse ? chartArea.left : chartArea.right
  const vStart = reverse ? chartArea.top : chartArea.bottom
  const vEnd = reverse ? chartArea.bottom : chartArea.top

  const gradient =
    direction === 'horizontal'
      ? ctx.createLinearGradient(hStart, 0, hEnd, 0)
      : ctx.createLinearGradient(0, vStart, 0, vEnd)

  gradient.addColorStop(0, colors.start)
  gradient.addColorStop(1, colors.end)

  return gradient
}

/**
 * Options shared by all charts, deep merged with `options`.
 */
export const getBaseChartOptions = <T extends 'line' | 'bar'>(options: ChartOptions<T>): ChartOptions<T> => {
  const baseOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 12,
        },
      },
      y: {
        border: {
          display: false,
        },
      },
    },
  }

  return merge({}, baseOptions, options) as ChartOptions<T>
}
