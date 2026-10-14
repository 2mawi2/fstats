'use client'

import { Box, Button, Typography } from '@mui/material'
import { uniq } from 'lodash'
import { useMemo, useState } from 'react'

import type { RowData } from '@/types'
import { getHeaderCandidates } from '@/utils/Parser'
import { useTranslation } from '@/lib/i18n'

import { getHeaderRowIndices } from '../../actions'
import HeaderRowPicker from '../HeaderRowPicker'
import { ui } from './styled'

type HeaderRowSectionProps = {
  rows: RowData[]
  headerIndex: number
  onChange: (headerIndex: number) => void
}

/**
 * The possible header rows (e.g. one per table) to pick from, all rows on request or if none was found.
 */
const Component = ({ rows, headerIndex, onChange }: HeaderRowSectionProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const candidates = useMemo(() => getHeaderCandidates(rows).map(({ index }) => index), [rows])
  const [showAllRows, setShowAllRows] = useState(() => !candidates.length)
  // The selected row too, it may have been picked from all rows
  const indices = showAllRows
    ? getHeaderRowIndices(rows, headerIndex)
    : uniq([...candidates, headerIndex]).sort((a, b) => a - b)

  return (
    <Box>
      <Typography component="div" sx={sx.label}>
        {t('STATS_PAGE.PARSER_SETUP.HEADER_ROW')}
      </Typography>
      <Box sx={sx.picker}>
        <Typography component="div" sx={sx.hint}>
          {candidates.length
            ? t('STATS_PAGE.PARSER_SETUP.HEADER_CANDIDATES', { count: candidates.length })
            : t('STATS_PAGE.PARSER_SETUP.HEADER_NONE')}
        </Typography>
        <HeaderRowPicker
          key={indices.join()}
          rows={rows}
          indices={indices}
          headerIndex={headerIndex}
          onChange={onChange}
        />
        {/* Without possible rows, all rows are always shown */}
        {candidates.length ? (
          <Button size="small" onClick={() => setShowAllRows((prev) => !prev)} sx={sx.toggle}>
            {t(showAllRows ? 'STATS_PAGE.PARSER_SETUP.SHOW_CANDIDATES' : 'STATS_PAGE.PARSER_SETUP.SHOW_ALL_ROWS')}
          </Button>
        ) : null}
      </Box>
    </Box>
  )
}

export default Component
