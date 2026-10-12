'use client'

import { Box, Typography } from '@mui/material'

import type { StatsFile } from '@/types'
import { MISC } from '@/common'
import { getFileCurrency, getFileTransactions, isParsed } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { formatFileSize } from '@/utils/File'

import { getFileFormat } from '../../actions'
import StatsList from '../StatsList'
import { ui } from './styled'

type FileDetailsProps = {
  file: StatsFile
}

const Component = ({ file }: FileDetailsProps) => {
  const sx = ui()
  const { locale } = useUserPreferences()
  const format = getFileFormat(file)

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
      {isParsed(file) ? <StatsList transactions={getFileTransactions(file)} currency={getFileCurrency(file)} /> : null}
    </Box>
  )
}

export default Component
