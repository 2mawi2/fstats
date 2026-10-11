'use client'

import { CloudUploadOutlined } from '@mui/icons-material'
import { Box, Link, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { MISC } from '@/common'
import { useIsDarkMode, useIsMobile } from '@/hooks'

import { openFolderPicker } from '../../actions'
import { ui } from './styled'

type DropZoneDisplayProps = {
  isDragActive: boolean
  onAddFiles: () => void
}

const Component = ({ isDragActive, onAddFiles }: DropZoneDisplayProps) => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile, isDarkMode)

  return (
    <Box sx={sx.wrapper}>
      <Box sx={{ ...sx.dropZoneBox(isDragActive), ...sx.dropZone }} onClick={onAddFiles}>
        <CloudUploadOutlined sx={sx.uploadIcon} />
        <Typography variant="h5">Drop files anywhere</Typography>
        <Typography variant="body2" color="text.secondary" sx={sx.subtitle}>
          or click to select files {MISC.CENTER_DOT}{' '}
          <Link
            component="button"
            variant="body2"
            onClick={(event) => {
              event.stopPropagation()
              openFolderPicker()
            }}
            sx={sx.folderLink}
          >
            select a folder
          </Link>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          CSV files only, max 5MB each
        </Typography>
      </Box>
    </Box>
  )
}

export default Component
