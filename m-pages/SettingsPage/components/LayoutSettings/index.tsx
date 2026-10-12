'use client'

import { CheckCircle } from '@mui/icons-material'
import { Box, ButtonBase, Card, Typography } from '@mui/material'
import { Fragment } from 'react'

import { MISC } from '@/common'
import { DataLayout, DEFAULT_DATA_COLUMN_WIDTHS, DEFAULT_DATA_EXPLORER_SPLIT, useDataLayout } from '@/hooks'

import { ui } from './styled'

type LayoutPreviewProps = {
  title: string
  columnWidths: number[]
  explorerSplit: number
  isSelected: boolean
  onSelect: () => void
  /**
   * Values that differ from these are shown in bold.
   */
  compareTo?: { columnWidths: number[]; explorerSplit: number }
}

const toPercent = (value: number) => `${Math.round(value)}%`

const isChanged = (value: number, defaultValue: number | undefined) =>
  defaultValue !== undefined && Math.round(value) !== Math.round(defaultValue)

const LayoutPreview = ({ title, columnWidths, explorerSplit, isSelected, onSelect, compareTo }: LayoutPreviewProps) => {
  const sx = ui()
  const [leftWidth, ...otherWidths] = columnWidths
  const isSplitChanged = isChanged(explorerSplit, compareTo?.explorerSplit)

  return (
    <ButtonBase onClick={onSelect} aria-pressed={isSelected} sx={sx.tile(isSelected)}>
      {isSelected ? <CheckCircle color="primary" sx={sx.check} /> : null}
      <Typography variant="caption" component="p" sx={sx.tileTitle}>
        {title}
      </Typography>
      <Box sx={sx.diagram}>
        <Box sx={{ ...sx.leftColumn, flexBasis: `${leftWidth}%` }}>
          <Box sx={{ ...sx.block, ...sx.changed(isSplitChanged), flexBasis: `${explorerSplit}%` }}>
            {toPercent(explorerSplit)}
          </Box>
          <Box sx={{ ...sx.block, ...sx.changed(isSplitChanged), flexBasis: `${100 - explorerSplit}%` }}>
            {toPercent(100 - explorerSplit)}
          </Box>
        </Box>
        {otherWidths.map((width, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index} sx={{ ...sx.block, flexBasis: `${width}%` }} />
        ))}
      </Box>
      <Typography variant="caption" component="p" sx={sx.tileCaption}>
        Columns{' '}
        {columnWidths.map((width, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            {index > 0 ? ` ${MISC.CENTER_DOT} ` : null}
            <Box component="span" sx={sx.changed(isChanged(width, compareTo?.columnWidths[index]))}>
              {toPercent(width)}
            </Box>
          </Fragment>
        ))}
      </Typography>
    </ButtonBase>
  )
}

const Component = () => {
  const sx = ui()
  const { customColumnWidths, customExplorerSplit, activeLayout, setActiveLayout } = useDataLayout()

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        Data page layout
      </Typography>

      <Box sx={sx.tiles}>
        <LayoutPreview
          title="Custom"
          columnWidths={customColumnWidths}
          explorerSplit={customExplorerSplit}
          isSelected={activeLayout === DataLayout.CUSTOM}
          onSelect={() => setActiveLayout(DataLayout.CUSTOM)}
          compareTo={{ columnWidths: DEFAULT_DATA_COLUMN_WIDTHS, explorerSplit: DEFAULT_DATA_EXPLORER_SPLIT }}
        />
        <LayoutPreview
          title="Default"
          columnWidths={DEFAULT_DATA_COLUMN_WIDTHS}
          explorerSplit={DEFAULT_DATA_EXPLORER_SPLIT}
          isSelected={activeLayout === DataLayout.DEFAULT}
          onSelect={() => setActiveLayout(DataLayout.DEFAULT)}
        />
      </Box>

      <Typography variant="caption" component="p" color="text.secondary" sx={sx.hint}>
        Resizing columns while the default layout is selected starts a new custom layout.
      </Typography>
    </Card>
  )
}

export default Component
