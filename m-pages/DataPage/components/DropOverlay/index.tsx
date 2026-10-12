'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

/**
 * Covers the dropzone while files are dragged over it.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()

  return (
    <Box sx={sx.dropOverlay}>
      <CloudUploadOutlined sx={{ fontSize: 48 }} />
      <Typography variant="h5">{t('DATA_PAGE.DROP_FILES_HERE')}</Typography>
    </Box>
  )
}

export default Component
