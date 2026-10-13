import { grey } from '@mui/material/colors'
import { alpha } from '@mui/material/styles'
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
/**
 * Current value of a theme CSS variable (e.g. `--mui-palette-divider`). Canvases can't use the variables, and with CSS
 * variables `theme.palette` only has the light mode colors, so read it while drawing (scriptable options).
 */
export const getThemeColor = (name: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export const getBaseChartOptions = <T extends 'line' | 'bar'>(options: ChartOptions<T>): ChartOptions<T> => {
  const baseOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      // White box with a grey border like the cards, from the theme's CSS variables so it follows the color mode
      tooltip: {
        backgroundColor: () => getThemeColor('--mui-palette-background-paper'),
        borderColor: () => getThemeColor('--mui-palette-divider'),
        borderWidth: 1,
        titleColor: () => getThemeColor('--mui-palette-text-secondary'),
        bodyColor: () => getThemeColor('--mui-palette-text-primary'),
        titleFont: { size: 11, weight: 500 },
        bodyFont: { size: 12, weight: 600 },
        titleMarginBottom: 2,
        padding: { x: 10, y: 8 },
        cornerRadius: 6,
        caretSize: 0,
        caretPadding: 8,
        // A single series per chart, the color box adds nothing
        displayColors: false,
      },
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

/**
 * Line of a single series chart.
 */
export const getLineColor = (isDarkMode: boolean) => {
  return isDarkMode ? grey[300] : grey[800]
}

/**
 * Soft area below the line, fading out towards the axis.
 */
export const getAreaFill = (color: string, opacity = 0.16) => {
  return ({ chart }: ScriptableContext<'line'>) => {
    const { ctx, chartArea } = chart

    if (!chartArea) {
      return 'transparent'
    }

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
    gradient.addColorStop(0, alpha(color, opacity))
    gradient.addColorStop(1, alpha(color, 0))
    return gradient
  }
}
