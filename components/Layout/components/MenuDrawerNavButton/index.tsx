'use client'

import { ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import type { ReactNode } from 'react'

type MenuDrawerNavButtonProps = {
  route: string
  onClose: VoidFunction
  children: ReactNode
  isActive?: boolean
  isExternal?: boolean
}

const Component = ({
  route,
  onClose,
  children,
  isActive = false,
  isExternal = false,
}: MenuDrawerNavButtonProps) => {
  const theme = useTheme()
  const linkProps = isExternal
    ? { component: 'a', href: route, target: '_blank', rel: 'noopener noreferrer' }
    : { component: Link, href: route }

  return (
    <ListItem disablePadding>
      <ListItemButton
        {...linkProps}
        onClick={onClose}
        sx={{
          mx: 1.5,
          mb: 0.5,
          px: 0.5,
          py: 1.75,
          borderRadius: 3.5,
          backgroundColor: isActive ? theme.vars.palette.action.hover : 'transparent',
        }}
      >
        <ListItemText
          primary={children}
          sx={{ pl: 2 }}
          slotProps={{
            primary: {
              sx: {
                fontSize: 18,
                fontWeight: isActive ? 'bold' : 'normal',
              },
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default Component
