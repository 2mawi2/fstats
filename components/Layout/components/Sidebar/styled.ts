import type { Theme } from '@mui/material/styles'

import { LAYOUT } from '@/common'

export const ui = (theme: Theme, expanded: boolean) => {
  return {
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: expanded ? LAYOUT.SIDEBAR_WIDTH_EXPANDED : LAYOUT.SIDEBAR_WIDTH,
      transition: 'width 0.2s',
      overflowX: 'hidden',
      zIndex: LAYOUT.NAV_Z_INDEX,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      pt: 1,
      pb: 2,
      px: 1,
      borderRight: `${LAYOUT.NAV_BORDER}px solid ${theme.vars.palette.divider}`,
      backgroundColor: theme.vars.palette.background.default,

      '@media print': {
        display: 'none',
      },
    },

    group: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    },
  }
}
