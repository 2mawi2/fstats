'use client'

import { Box, Checkbox, CircularProgress, ListItem, ListItemButton, Tooltip, Typography } from '@mui/material'

import type { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { isError, isParsed, isUnknown } from '@/m-stats-file/service'
import { useTranslation } from '@/lib/i18n'

import { getFileFormat, getFileNameColor } from '../../actions'
import FileStatusIcon from '../FileStatusIcon'
import { ui } from './styled'

type FileRowProps = {
  file: StatsFile
  isChecked: boolean
  onToggle: (fileId: string) => void
  disabled?: boolean
}

const Component = ({ file, isChecked, onToggle, disabled = false }: FileRowProps) => {
  const sx = ui()
  // Re-render on language change, the format label is translated
  useTranslation()
  const format = getFileFormat(file)

  return (
    <ListItem disablePadding divider>
      <ListItemButton onClick={() => onToggle(file.id)} disabled={disabled} sx={sx.row}>
        <Checkbox size="small" checked={isChecked} tabIndex={-1} disableRipple sx={sx.checkbox} />
        <Typography
          sx={{ ...sx.name, color: getFileNameColor(file), fontWeight: isChecked ? 700 : 400 }}
          title={file.file.name}
        >
          {file.file.name}
        </Typography>
        {file.status === StatsFileStatus.PARSING ? (
          <CircularProgress size={12} sx={sx.status} />
        ) : isUnknown(file) || isError(file) ? (
          <Tooltip title={format.value}>
            <FileStatusIcon file={file} sx={sx.status} />
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
