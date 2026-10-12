'use client'

import { ErrorOutlined, WarningOutlined } from '@mui/icons-material'
import { Box, Checkbox, CircularProgress, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material'

import type { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { isError, isParsed, isUnknown } from '@/m-stats-file/service'
import { useTranslation } from '@/lib/i18n'

import { getFileFormat } from '../../actions'
import { ui } from './styled'

type FileRowProps = {
  file: StatsFile
  isChecked: boolean
  onToggle: (fileId: string) => void
}

const Component = ({ file, isChecked, onToggle }: FileRowProps) => {
  const sx = ui()
  // Re-render on language change, the format label is translated
  useTranslation()
  const isUnknownFile = isUnknown(file)
  const isErrorFile = isError(file)
  const nameColor = isUnknownFile ? 'warning.main' : isErrorFile ? 'error.main' : 'text.primary'
  const format = getFileFormat(file)

  return (
    <ListItem disablePadding divider>
      <ListItemButton onClick={() => onToggle(file.id)} sx={sx.row}>
        <Checkbox size="small" checked={isChecked} tabIndex={-1} disableRipple sx={sx.checkbox} />
        <Typography sx={{ ...sx.name, color: nameColor, fontWeight: isChecked ? 700 : 400 }} title={file.file.name}>
          {file.file.name}
        </Typography>
        {file.status === StatsFileStatus.PARSING ? (
          <CircularProgress size={12} sx={sx.status} />
        ) : isUnknownFile || isErrorFile ? (
          <Tooltip title={format.value}>
            {isUnknownFile ? (
              <WarningOutlined color="warning" sx={sx.status} />
            ) : (
              <ErrorOutlined color="error" sx={sx.status} />
            )}
          </Tooltip>
        ) : null}
        {isParsed(file) ? (
          <Box component="span" title={format.value} sx={sx.bankChip}>
            {format.value}
          </Box>
        ) : null}
      </ListItemButton>
    </ListItem>
  )
}

export default Component
