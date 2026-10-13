import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { LAYOUT, MISC } from '@/common'

export const ui = (theme: Theme) => {
  return {
    menuContainer: {
      zIndex: LAYOUT.NAV_Z_INDEX,
      position: 'sticky',
      top: 0,
      width: '100%',
      background: `rgba(255, 255, 255, ${MISC.GLASS_EFFECT})`,
      [theme.getColorSchemeSelector(ColorMode.DARK)]: {
        background: `rgba(42, 46, 54, ${MISC.GLASS_EFFECT})`,
      },
      backdropFilter: 'blur(10px)',
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
