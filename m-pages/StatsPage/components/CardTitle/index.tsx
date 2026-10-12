import { Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'
import type { ReactNode } from 'react'

type CardTitleProps = {
  children: ReactNode
  sx?: SxProps<Theme>
}

const Component = ({ children, sx }: CardTitleProps) => {
  return (
    <Typography variant="h6" color="secondary" sx={sx}>
      {children}
    </Typography>
  )
}

export default Component
