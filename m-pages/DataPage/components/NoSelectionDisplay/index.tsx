'use client'

import { ChecklistOutlined } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

/**
 * Shown in place of the data when there are files, but none are checked.
 */
const Component = () => {
  const sx = ui()
  const { t } = useTranslation()

  return (
    <Box sx={sx.wrapper}>
      <Box sx={sx.iconCircle}>
        <ChecklistOutlined sx={sx.icon} />
      </Box>
      <Typography variant="h6">{t('DATA_PAGE.NO_FILE_SELECTED')}</Typography>
      <Typography variant="body2" color="text.secondary" sx={sx.subtitle}>
        {t('DATA_PAGE.CHECK_FILE_FOR_DATA')}
      </Typography>
    </Box>
  )
}

export default Component
