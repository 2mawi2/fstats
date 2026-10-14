'use client'

import { ErrorOutlined, WarningOutlined } from '@mui/icons-material'
import type { SxProps, Theme } from '@mui/material'

import type { StatsFile } from '@/types'
import { isError, isUnknown } from '@/m-stats-file/service'

type FileStatusIconProps = {
  file: StatsFile
  sx?: SxProps<Theme>
}

/**
 * Warning for unsupported files, error for invalid files, nothing otherwise (convertible files have a setup button). Rest props (incl. `ref`) are forwarded, so
 * it works as a `Tooltip` child.
 */
const Component = ({ file, sx, ...props }: FileStatusIconProps) => {
  if (isUnknown(file)) {
    return <WarningOutlined color="warning" sx={sx} {...props} />
  }

  if (isError(file)) {
    return <ErrorOutlined color="error" sx={sx} {...props} />
  }

  return null
}

export default Component
