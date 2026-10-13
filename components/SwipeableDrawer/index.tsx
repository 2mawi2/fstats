'use client'

import { Box, SwipeableDrawer } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

import { useIsMobile } from '@/hooks'

import { SwipeableDrawerSubheader } from './components'
import { Puller, PullerWrapper, ui } from './styled'

type SwipeableDrawerProps = {
  title?: ReactNode
  anchor: 'left' | 'bottom'
  open: boolean
  onClose: VoidFunction
  onOpen: VoidFunction
  mainMenu?: boolean
  children: ReactNode
  headerSx?: SxProps<Theme>
  fixedHeader?: boolean
}

const Component = ({
  title,
  anchor,
  open,
  onClose,
  onOpen,
  mainMenu = false,
  children,
  headerSx = {},
  fixedHeader = false,
}: SwipeableDrawerProps) => {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const sx = ui(anchor, theme, isMobile)
  const isBottomDrawer = anchor === 'bottom'

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      elevation={0}
      disableSwipeToOpen
      slotProps={{
        paper: { sx: sx.drawer(mainMenu) },
        backdrop: { sx: sx.backdrop },
      }}
      sx={{ zIndex: theme.zIndex.drawer + 1 }}
    >
      <Box role="presentation">
        <Box sx={sx.subheaderWrapper(fixedHeader)}>
          {isMobile && isBottomDrawer ? (
            <PullerWrapper>
              <Puller />
            </PullerWrapper>
          ) : null}
          <SwipeableDrawerSubheader title={title} onClose={onClose} sx={headerSx} />
        </Box>
        {children}
      </Box>
    </SwipeableDrawer>
  )
}

export default Component
