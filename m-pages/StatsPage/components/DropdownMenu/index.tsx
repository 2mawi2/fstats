'use client'

import type { MenuItemProps, MenuProps } from '@mui/material'
import { Box, Divider, ListSubheader, Menu, MenuItem } from '@mui/material'
import type { ReactNode } from 'react'

import { ui } from './styled'

/**
 * Compact menu of a toolbar button, the same for all menus of the app (form selects have their own).
 */
const Component = ({ sx: menuSx, ...props }: MenuProps) => {
  const sx = ui()
  return <Menu {...props} sx={{ ...sx.menu, ...menuSx }} />
}

type DropdownMenuItemProps = Omit<MenuItemProps, 'children'> & {
  /**
   * Before the label, e.g. a switch.
   */
  start?: ReactNode
  label: ReactNode
  /**
   * Shown on the right, e.g. the number of files.
   */
  count?: number
}

export const DropdownMenuItem = ({ start, label, count, sx: itemSx, ...props }: DropdownMenuItemProps) => {
  const sx = ui()

  return (
    <MenuItem {...props} sx={{ ...sx.item, ...itemSx }}>
      {start}
      <Box component="span" sx={sx.label}>
        {label}
      </Box>
      {count !== undefined ? (
        <Box component="span" sx={sx.count}>
          {count}
        </Box>
      ) : null}
    </MenuItem>
  )
}

export const DropdownMenuDivider = () => {
  const sx = ui()
  return <Divider sx={sx.divider} />
}

export const DropdownMenuSubheader = ({ children }: { children: ReactNode }) => {
  const sx = ui()
  return <ListSubheader sx={sx.subheader}>{children}</ListSubheader>
}

export default Component
