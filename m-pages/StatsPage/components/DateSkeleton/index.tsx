'use client'

import { ChevronRight, ExpandMore } from '@mui/icons-material'
import { Box, Skeleton, Tooltip } from '@mui/material'

import type { DateRow } from '../DateExplorer/actions'
import { getRowHeight, ROW_INDENT } from '../DateExplorer/actions'
import { ui } from './styled'

// A year, an expanded month with some of its days and two collapsed months, label widths in px
const ROWS: { type: DateRow['type']; width: number; isExpanded?: boolean }[] = [
  { type: 'year', width: 36, isExpanded: true },
  { type: 'month', width: 48, isExpanded: true },
  { type: 'day', width: 68 },
  { type: 'day', width: 68 },
  { type: 'day', width: 68 },
  { type: 'month', width: 56 },
  { type: 'month', width: 44 },
]

type DateSkeletonProps = {
  /**
   * Explains why the date explorer isn't shown, shown on hover.
   */
  title: string
}

/**
 * Static outline of the date explorer, same layout as its rows, shown when it doesn't apply (the CSV view) or has no
 * dates.
 */
const Component = ({ title }: DateSkeletonProps) => {
  const sx = ui()

  return (
    <Tooltip title={title} placement="top">
      <Box sx={sx.skeleton}>
        {ROWS.map((row, index) => (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            sx={sx.row}
            style={{ height: getRowHeight(row), paddingLeft: ROW_INDENT[row.type] }}
          >
            {row.type === 'month' ? (
              <Box sx={sx.expandIcon}>
                <ChevronRight style={{ transform: row.isExpanded ? 'rotate(90deg)' : undefined }} />
              </Box>
            ) : row.type === 'day' ? (
              <Box sx={sx.expandSpacer} />
            ) : null}
            <Box sx={sx.checkbox}>
              <Skeleton variant="rounded" animation={false} width={13} height={13} sx={sx.checkboxBox} />
            </Box>
            <Skeleton variant="text" animation={false} width={row.width} height={row.type === 'year' ? 16 : 14} />
            {row.type === 'year' ? (
              <Box sx={{ ...sx.expandIcon, ...sx.expandIconEnd }}>
                <ExpandMore style={{ transform: row.isExpanded ? 'rotate(180deg)' : undefined }} />
              </Box>
            ) : null}
          </Box>
        ))}
      </Box>
    </Tooltip>
  )
}

export default Component
