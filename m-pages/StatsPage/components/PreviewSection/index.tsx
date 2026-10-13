'use client'

import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

import type { StatsFile } from '@/types'
import { useTranslation } from '@/lib/i18n'

import { getFileNameColor } from '../../actions'
import { ui } from './styled'

type PreviewSectionProps = {
  title: string
  /**
   * The file shown, its status is indicated by the title color.
   */
  file?: StatsFile
  /**
   * Small label next to the title, e.g. the currency.
   */
  chip?: string
  /**
   * Next to the title, e.g. the row count.
   */
  caption?: string
  isLoading?: boolean
  error?: string | null
  /**
   * The title stays at the top while scrolling. Only for the first section of the scroll container.
   */
  isSticky?: boolean
  children?: ReactNode
}

const Component = ({
  title,
  file,
  chip,
  caption,
  isLoading = false,
  error = null,
  isSticky = false,
  children,
}: PreviewSectionProps) => {
  const sx = ui()
  const { t } = useTranslation()

  return (
    <Box component="section" sx={sx.section}>
      <Box sx={isSticky ? { ...sx.header, ...sx.stickyHeader } : sx.header}>
        <Typography variant="body2" sx={file ? { ...sx.title, color: getFileNameColor(file) } : sx.title}>
          {title}
          {chip ? (
            <Box component="span" sx={sx.chip}>
              {chip}
            </Box>
          ) : null}
          {caption ? (
            <Box component="span" sx={sx.rowCount}>
              {caption}
            </Box>
          ) : null}
        </Typography>
      </Box>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          {t('MISC.LOADING')}
        </Typography>
      ) : error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : (
        children
      )}
    </Box>
  )
}

export default Component
