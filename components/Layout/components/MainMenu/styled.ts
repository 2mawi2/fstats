import type { Theme } from '@mui/material/styles'

import { ColorMode } from '@/types-enums'
import { LAYOUT, MISC } from '@/common'

export const ui = (theme: Theme, isDarkMode: boolean, isMobile: boolean) => {
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
      height: isMobile ? LAYOUT.NAV_HEIGHT_MOBILE : LAYOUT.NAV_HEIGHT,
    },

    menu: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 0.5 : 1,
    },

    iconMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 0 : 0.5,
      opacity: 0.75,
    },

    divider: {
      position: 'sticky',
      top: isMobile ? LAYOUT.NAV_HEIGHT_MOBILE : LAYOUT.NAV_HEIGHT,
      borderWidthBottom: LAYOUT.NAV_BORDER,
      zIndex: LAYOUT.NAV_Z_INDEX + 1,
    },
  }
}
