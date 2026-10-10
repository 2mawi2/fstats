'use client'

import { Box } from '@mui/material'
import type { ReactNode } from 'react'

import { LAYOUT } from '@/common'
import { useIsMobile } from '@/hooks'

type PageWrapperProps = {
  children?: ReactNode
}

const Component = ({ children }: PageWrapperProps) => {
  const isMobile = useIsMobile()

  return (
    <Box
      sx={{
        pt: 4,
        pb: 12,
        maxWidth: '100%',
        minHeight: isMobile ? `calc(100vh - ${LAYOUT.NAV_HEIGHT_MOBILE + LAYOUT.NAV_BORDER}px)` : '100vh',

        '@media print': {
          maxWidth: 'none',
          overflowX: 'visible',
          p: 0,
        },
      }}
    >
      {children}
    </Box>
  )
}

export default Component
