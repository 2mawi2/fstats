'use client'

import { List } from '@mui/material'
import type { ReactNode } from 'react'

import { ui } from './styled'

type StatsCardProps = {
  children: ReactNode
}

/**
 * Bordered list of `StatsRow`s.
 */
const Component = ({ children }: StatsCardProps) => {
  const sx = ui()

  return (
    <List disablePadding sx={sx.card}>
      {children}
    </List>
  )
}

export default Component
