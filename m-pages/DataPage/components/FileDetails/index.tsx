'use client'

import { Box, Typography } from '@mui/material'

import type { StatsFile } from '@/types'
import { MISC } from '@/common'
import { isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { formatFileSize } from '@/utils/File'
import { toFixedLocale, toFixedLocaleCurrency } from '@/utils/Number'
import { getParserCurrency } from '@/utils/Parser'
import { getStats } from '@/utils/Stats'
import { Big } from '@/lib/w-big'

import { getFileFormat } from '../../actions'
import { ui } from './styled'

type FileDetailsProps = {
  file: StatsFile
}

type Detail = { label: string; value: string; color?: string }

const Component = ({ file }: FileDetailsProps) => {
  const sx = ui()
  const { locale } = useUserPreferences()
  const format = getFileFormat(file)

  const getFileStats = (): Detail[] => {
    if (!isParsed(file)) {
      return []
    }

    const currency = getParserCurrency(file.parserId)
    const { totalIncome, totalExpense, profit, profitMargin } = getStats(file.transactions)

    return [
      { label: 'Transactions', value: String(file.transactions.length) },
      { label: 'Income', value: toFixedLocaleCurrency(totalIncome, currency, locale), color: 'success.main' },
      { label: 'Expenses', value: toFixedLocaleCurrency(totalExpense, currency, locale), color: 'error.main' },
      {
        label: 'Balance',
        value: toFixedLocaleCurrency(profit, currency, locale),
        color: Big(profit).gte(0) ? 'success.main' : 'error.main',
      },
      { label: 'Profit margin', value: `${toFixedLocale(profitMargin, 1, locale, { trimTrailingZeros: true })}%` },
    ]
  }

  const renderList = (details: Detail[]) => (
    <Box component="dl" sx={sx.list}>
      {details.map((detail) => (
        <Box key={detail.label} sx={sx.row}>
          <Typography component="dt" variant="body2" color="text.secondary" sx={sx.label}>
            {detail.label}
          </Typography>
          <Typography component="dd" variant="body2" sx={{ ...sx.value, color: detail.color }}>
            {detail.value}
          </Typography>
        </Box>
      ))}
    </Box>
  )

  const fileStats = getFileStats()

  return (
    <Box component="section" sx={sx.section}>
      <Typography variant="body2" sx={sx.title} title={file.file.name}>
        {file.file.name}
      </Typography>
      <Box sx={sx.info}>
        <Box sx={{ ...sx.format, color: format.color }} title={format.value}>
          {format.value}
        </Box>
        <Box sx={sx.meta}>
          {formatFileSize(file.file.size)} {MISC.CENTER_DOT}{' '}
          {toDisplayDate(new Date(file.created), locale, { formatTo: 'd MMM yyyy, HH:mm' })}
        </Box>
      </Box>
      {fileStats.length ? renderList(fileStats) : null}
    </Box>
  )
}

export default Component
