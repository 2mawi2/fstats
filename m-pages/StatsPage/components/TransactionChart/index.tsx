'use client'

import { Box, Card } from '@mui/material'
import type { ChartData, ChartDataset } from 'chart.js'
import { useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useDebounceCallback, useResizeObserver } from 'usehooks-ts'

import type { Size, Transaction } from '@/types'
import { Currency } from '@/types-enums'
import { BarChart } from '@/components'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { useTranslation } from '@/lib/i18n'
import { Big } from '@/lib/w-big'

import CardTitle from '../CardTitle'
import { getBackgroundColour, getBarThickness, getBorderRadius, getChartOptions } from './actions'
import { ui } from './styled'

type TransactionChartProps = {
  transactions: Transaction[]
  currency: Currency
}

const Component = ({ transactions, currency }: TransactionChartProps) => {
  const { t } = useTranslation()
  const { locale, dateFormat } = useUserPreferences()
  const sx = ui()
  const ref = useRef<HTMLDivElement>(null)
  const [{ width = 0 }, setSize] = useState<Size>({ width: undefined, height: undefined })

  useResizeObserver({
    ref: ref as RefObject<HTMLDivElement>,
    onResize: useDebounceCallback(setSize, 200),
  })

  const dataset: ChartDataset<'bar'> = {
    type: 'bar',
    label: t('MISC.TRANSACTIONS'),
    data: transactions.map((row) => Big(row.value).toNumber()),
    backgroundColor: getBackgroundColour,
    borderRadius: getBorderRadius,
    barThickness: getBarThickness({ transactions, chartWidth: width }),
    order: 2,
  }

  const chartData: ChartData = {
    labels: transactions.map((row) => toDisplayDate(row.date, locale, { formatTo: dateFormat })),
    datasets: [dataset],
  }

  const chartOptions = getChartOptions({ currency, locale })

  return (
    <Card>
      <CardTitle>{t('STATS_PAGE.CASHFLOW')}</CardTitle>

      <Box sx={sx.chartCard} ref={ref}>
        {/* @ts-expect-error Type '"line"' is not assignable to type '"bar"'. */}
        <BarChart type="bar" data={chartData} options={chartOptions} />
      </Box>
    </Card>
  )
}

export default Component
