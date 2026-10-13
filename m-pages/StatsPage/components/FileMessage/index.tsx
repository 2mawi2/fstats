'use client'

import { Box } from '@mui/material'

import type { StatsFile } from '@/types'

import { getFileNameColor } from '../../actions'
import FileStatusIcon from '../FileStatusIcon'
import { ui } from './styled'

type FileMessageProps = {
  file: StatsFile
  message: string
}

/**
 * Message in place of a file's table, styled like a single table row, with the file's status icon and color.
 */
const Component = ({ file, message }: FileMessageProps) => {
  const sx = ui()

  return (
    <Box sx={{ ...sx.row, color: getFileNameColor(file) }}>
      <FileStatusIcon file={file} sx={sx.icon} />
      <Box component="span" title={message} sx={sx.message}>
        {message}
      </Box>
    </Box>
  )
}

export default Component
