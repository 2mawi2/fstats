'use client'

import { Check } from '@mui/icons-material'
import type { StepIconProps } from '@mui/material'
import { Box } from '@mui/material'

import { ui } from './styled'

/**
 * Circle of a fixed size with the step number, or a check once completed (also when going back to it), centered. The
 * current step stands out.
 */
const Component = ({ active = false, completed = false, icon }: StepIconProps) => {
  const sx = ui()

  return (
    <Box component="span" sx={{ ...sx.circle, ...(active ? sx.active : completed ? sx.completed : null) }}>
      {completed ? <Check sx={sx.check} /> : icon}
    </Box>
  )
}

export default Component
