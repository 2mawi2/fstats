'use client'

import { CheckCircle } from '@mui/icons-material'
import { Box, ButtonBase, Typography } from '@mui/material'
import { Fragment } from 'react'

import { MISC } from '@/common'
import { DEFAULT_STATS_COLUMN_WIDTHS, DEFAULT_STATS_EXPLORER_SPLIT, StatsLayout, useStatsLayout } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import SettingsCard from '../SettingsCard'
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
  const { t } = useTranslation()
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
        {t('SETTINGS_PAGE.LAYOUT.COLUMNS')}{' '}
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
  const { t } = useTranslation()
  const { customColumnWidths, customExplorerSplit, activeLayout, setActiveLayout } = useStatsLayout()
  const isCustomSameAsDefault =
    !isChanged(customExplorerSplit, DEFAULT_STATS_EXPLORER_SPLIT) &&
    customColumnWidths.every((width, index) => !isChanged(width, DEFAULT_STATS_COLUMN_WIDTHS[index]))

  return (
    <SettingsCard title={t('SETTINGS_PAGE.LAYOUT.TITLE')}>
      <Box sx={sx.tiles}>
        <LayoutPreview
          title={t('SETTINGS_PAGE.LAYOUT.DEFAULT')}
          columnWidths={DEFAULT_STATS_COLUMN_WIDTHS}
          explorerSplit={DEFAULT_STATS_EXPLORER_SPLIT}
          isSelected={activeLayout === StatsLayout.DEFAULT || isCustomSameAsDefault}
          onSelect={() => setActiveLayout(StatsLayout.DEFAULT)}
        />
        {isCustomSameAsDefault ? null : (
          <LayoutPreview
            title={t('SETTINGS_PAGE.LAYOUT.CUSTOM')}
            columnWidths={customColumnWidths}
            explorerSplit={customExplorerSplit}
            isSelected={activeLayout === StatsLayout.CUSTOM}
            onSelect={() => setActiveLayout(StatsLayout.CUSTOM)}
            compareTo={{ columnWidths: DEFAULT_STATS_COLUMN_WIDTHS, explorerSplit: DEFAULT_STATS_EXPLORER_SPLIT }}
          />
        )}
      </Box>

      <Typography variant="caption" component="p" color="text.secondary" sx={sx.hint}>
        {t('SETTINGS_PAGE.LAYOUT.HINT')}
      </Typography>
    </SettingsCard>
  )
}

export default Component
