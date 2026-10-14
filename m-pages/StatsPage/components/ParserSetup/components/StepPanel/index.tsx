'use client'

import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

import { ui } from './styled'

type StepPanelProps = {
  title: string
  hint?: string
  children?: ReactNode
  /**
   * Buttons below the content, the primary one first.
   */
  actions: ReactNode
  /**
   * The full width of the column, e.g. for the column connector. Forms are narrower to stay readable.
   */
  isFullWidth?: boolean
}

/**
 * One step of the setup: a question or task with a hint, the form, and the buttons to move on or back.
 */
const Component = ({ title, hint, children, actions, isFullWidth = false }: StepPanelProps) => {
  const sx = ui()

  return (
    <Box component="section" sx={{ ...sx.panel, ...(isFullWidth ? sx.fullWidth : null) }}>
      <Box>
        <Typography component="h3" sx={sx.title}>
          {title}
        </Typography>
        {hint ? (
          <Typography component="div" sx={sx.hint}>
            {hint}
          </Typography>
        ) : null}
      </Box>
      {children}
      <Box sx={sx.actions}>{actions}</Box>
    </Box>
  )
}

export default Component
