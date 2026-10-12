'use client'

import { Button, IconButton, Tooltip, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { useIsMobile } from '@/hooks'

import SwipeableDrawer from '../SwipeableDrawer'
import { OptionList } from './components'
import type { Option } from './components/OptionList'

export type { Option }

type OptionSwitcherProps<T extends string> = {
  title: string
  icon: ReactNode
  label: ReactNode
  showLabel?: boolean
  fixedHeader?: boolean
  listSx?: SxProps<Theme>
  options: Option<T>[]
  onSelect: (value: T) => void
}

const Component = <T extends string>({
  title,
  icon,
  label,
  showLabel = false,
  fixedHeader = false,
  listSx,
  options,
  onSelect,
}: OptionSwitcherProps<T>) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const onOptionSelected = (value: T) => {
    onSelect(value)
    onClose()
  }

  return (
    <>
      <Tooltip title={title}>
        {showLabel ? (
          <Button
            size={isMobile ? 'large' : 'small'}
            color="secondary"
            onClick={onOpen}
            sx={{
              minWidth: 0,
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
            }}
            startIcon={icon}
          >
            <Typography sx={{ fontSize: 14, lineHeight: 1.2 }}>{label}</Typography>
          </Button>
        ) : (
          <IconButton size={isMobile ? 'large' : 'medium'} color="secondary" onClick={onOpen}>
            {icon}
          </IconButton>
        )}
      </Tooltip>

      <SwipeableDrawer
        title={title}
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        fixedHeader={fixedHeader}
      >
        <OptionList options={options} onSelect={onOptionSelected} sx={listSx} />
      </SwipeableDrawer>
    </>
  )
}

export default Component
