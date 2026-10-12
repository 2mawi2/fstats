'use client'

import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

type PreviewSectionProps = {
  title: string
  rowCount?: number
  isLoading?: boolean
  error?: string | null
  children?: ReactNode
}

const Component = ({ title, rowCount, isLoading = false, error = null, children }: PreviewSectionProps) => {
  const sx = ui()
  const { t } = useTranslation()

  return (
    <Box component="section" sx={sx.section}>
      <Typography variant="body2" sx={sx.title}>
        {title}
        {rowCount !== undefined ? (
          <Box component="span" sx={sx.rowCount}>
            {t('DATA_PAGE.ROW_COUNT', { count: rowCount })}
          </Box>
        ) : null}
      </Typography>
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
