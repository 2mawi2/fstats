'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { MISC } from '@/common'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { Trans, useTranslation } from '@/lib/i18n'

import { openFolderPicker } from '../../actions'
import { ui } from './styled'

type DropZoneDisplayProps = {
  isDragActive: boolean
  onAddFiles: () => void
}

const Component = ({ isDragActive, onAddFiles }: DropZoneDisplayProps) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)

  return (
    <Box sx={sx.wrapper}>
      <Box sx={{ ...sx.dropZoneBox(isDragActive), ...sx.dropZone }} onClick={onAddFiles}>
        <CloudUploadOutlined sx={sx.uploadIcon} />
        <Typography variant="h5">{t('DATA_PAGE.DROP_FILES_ANYWHERE')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={sx.subtitle}>
          <Trans
            i18nKey="DATA_PAGE.CLICK_TO_SELECT"
            values={{ dot: MISC.CENTER_DOT }}
            components={{
              link: (
                <Link
                  component="button"
                  variant="body2"
                  onClick={(event) => {
                    event.stopPropagation()
                    openFolderPicker()
                  }}
                  sx={sx.folderLink}
                />
              ),
            }}
          />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('DATA_PAGE.FILE_RESTRICTIONS')}
        </Typography>
      </Box>
    </Box>
  )
}

export default Component
