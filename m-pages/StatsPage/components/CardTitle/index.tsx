import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

import { ui } from './styled'

type CardTitleProps = {
  children: ReactNode
  caption?: ReactNode
  action?: ReactNode
}

/**
 * Section header, like the preview headers of the data page.
 */
const Component = ({ children, caption, action }: CardTitleProps) => {
  const sx = ui()

  return (
    <Box sx={sx.header}>
      <Typography component="h2" variant="body2" sx={sx.title}>
        {children}
        {caption ? (
          <Box component="span" sx={sx.caption}>
            {caption}
          </Box>
        ) : null}
      </Typography>
      {action}
    </Box>
  )
}

export default Component
