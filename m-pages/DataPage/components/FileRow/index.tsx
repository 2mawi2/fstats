'use client'

import { ErrorOutlined, ExpandLess, ExpandMore, WarningOutlined } from '@mui/icons-material'
import {
  Box,
  Checkbox,
  CircularProgress,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  Tooltip,
  Typography,
} from '@mui/material'
import type { MouseEvent } from 'react'
import { useState } from 'react'

import type { StatsFile } from '@/types'
import { StatsFileStatus } from '@/types-enums'
import { MISC } from '@/common'
import { isError, isParsed, isUnknown } from '@/m-stats-file/service'
import { useUserPreferences } from '@/hooks'
import { toDisplayDate } from '@/utils/Date'
import { formatFileSize } from '@/utils/File'
import { getBankAccountName } from '@/utils/Parser'

import { ui } from './styled'

type FileRowProps = {
  file: StatsFile
  isChecked: boolean
  onToggle: (fileId: string) => void
}

const getFormat = (file: StatsFile) => {
  if (isParsed(file)) {
    return { value: getBankAccountName(file.parserId).long, color: 'text.primary' }
  }

  if (file.status === StatsFileStatus.PARSING) {
    return { value: 'Parsing…', color: 'text.secondary' }
  }

  if (isUnknown(file)) {
    return { value: 'Unsupported format', color: 'warning.main' }
  }

  return { value: file.status === StatsFileStatus.ERROR ? file.error.message : '-', color: 'error.main' }
}

const Component = ({ file, isChecked, onToggle }: FileRowProps) => {
  const sx = ui()
  const [expanded, setExpanded] = useState(false)
  const { locale } = useUserPreferences()
  const isUnknownFile = isUnknown(file)
  const isErrorFile = isError(file)
  const nameColor = isUnknownFile ? 'warning.main' : isErrorFile ? 'error.main' : 'text.primary'
  const format = getFormat(file)

  const toggleExpanded = (event: MouseEvent) => {
    event.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <ListItem disablePadding divider sx={sx.item(expanded)}>
      <ListItemButton onClick={() => onToggle(file.id)} sx={sx.row}>
        <Checkbox size="small" checked={isChecked} tabIndex={-1} disableRipple sx={sx.checkbox} />
        <Typography sx={{ ...sx.name, color: nameColor, fontWeight: isChecked ? 700 : 400 }} title={file.file.name}>
          {file.file.name}
        </Typography>
        <Box sx={sx.status}>
          {file.status === StatsFileStatus.PARSING ? (
            <CircularProgress size={12} />
          ) : isUnknownFile || isErrorFile ? (
            <Tooltip title={expanded ? 'Hide details' : format.value}>
              <IconButton
                size="small"
                color={isUnknownFile ? 'warning' : 'error'}
                onClick={toggleExpanded}
                sx={sx.statusButton}
              >
                {isUnknownFile ? <WarningOutlined /> : <ErrorOutlined />}
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
        {/* The warning/error icon already toggles the details */}
        {isUnknownFile || isErrorFile ? null : (
          <Tooltip title={expanded ? 'Hide details' : 'Show details'}>
            <IconButton
              size="small"
              onClick={toggleExpanded}
              className={expanded ? 'chevron expanded' : 'chevron'}
              sx={sx.chevronButton}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
        )}
      </ListItemButton>

      <Collapse in={expanded} unmountOnExit>
        <Box sx={sx.details}>
          <Box sx={{ ...sx.format, color: format.color }} title={format.value}>
            {format.value}
          </Box>
          <Box sx={sx.meta}>
            {formatFileSize(file.file.size)} {MISC.CENTER_DOT}{' '}
            {toDisplayDate(new Date(file.created), locale, { formatTo: 'd MMM yyyy, HH:mm' })}
          </Box>
        </Box>
      </Collapse>
    </ListItem>
  )
}

export default Component
