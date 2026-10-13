import type { Theme } from '@mui/material/styles'

import { accentColor, ctaButton } from '../../styled'

export const ui = (theme: Theme, isMobile: boolean) => {
  return {
    hero: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      pt: isMobile ? 2 : 6,
      pb: isMobile ? 2 : 4,
    },

    logo: {
      width: isMobile ? 96 : 128,
      height: 'auto',
      mb: 3,
    },

    title: {
      fontSize: isMobile ? 28 : 40,
      fontWeight: 800,
      lineHeight: 1.2,
      mb: 2,
    },

    titleAccent: accentColor(theme),

    subtitle: {
      color: 'text.secondary',
      maxWidth: 540,
      fontSize: isMobile ? 15 : 17,
      lineHeight: 1.7,
      mb: 4,
    },

    buttons: {
      display: 'flex',
      gap: 2,
      flexDirection: isMobile ? 'column' : 'row',
    },

    ctaButton,

    demoButton: {
      ...ctaButton,
      borderWidth: 2,
      '&:hover': {
        borderWidth: 2,
      },
    },
  }
}
