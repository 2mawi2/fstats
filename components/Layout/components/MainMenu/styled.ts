import type { Theme } from '@mui/material/styles'

import { LAYOUT } from '@/common'
import { sxGlass } from '@/styles/styled'

export const ui = (theme: Theme) => {
  return {
    menuContainer: {
      zIndex: LAYOUT.NAV_Z_INDEX,
      position: 'sticky',
      top: 0,
      width: '100%',
      ...sxGlass(theme),
    },

    menuWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: LAYOUT.NAV_HEIGHT_MOBILE,
    },

    menu: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    },

    iconMenu: {
      display: 'flex',
      alignItems: 'center',
      opacity: 0.75,
    },

    divider: {
      position: 'sticky',
      top: LAYOUT.NAV_HEIGHT_MOBILE,
      borderWidthBottom: LAYOUT.NAV_BORDER,
      zIndex: LAYOUT.NAV_Z_INDEX + 1,
    },
  }
}
