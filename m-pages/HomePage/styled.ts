import type { Theme } from '@mui/material/styles'

import { Color } from '@/styles/colors'

/**
 * Styles applied only in dark mode (via CSS, so there's no flash before the colour scheme is known).
 */
const darkStyles = (theme: Theme, styles: Record<string, string>) =>
  theme.applyStyles('dark', styles) as Record<string, typeof styles>

/**
 * Cyan accent, lighter in dark mode.
 */
export const accentColor = (theme: Theme) => ({
  color: Color.cyanDark,
  ...darkStyles(theme, { color: Color.cyan }),
})

export const ctaButton = {
  minWidth: 200,
  py: 1.5,
  px: 5,
  fontSize: 17,
  fontWeight: 600,
  borderRadius: 100,
}

export const ui = (theme: Theme, isMobile: boolean) => {
  return {
    trustSection: {
      mt: isMobile ? 4 : 6,
    },

    trustCard: {
      p: isMobile ? 2.5 : 3,
      borderRadius: 2,
      border: '1px solid rgba(0,96,100,0.15)',
      backgroundColor: 'rgba(0,96,100,0.04)',
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...darkStyles(theme, {
        borderColor: 'rgba(0,188,212,0.18)',
        backgroundColor: 'rgba(255,255,255,0.04)',
      }),
    },

    trustIcon: {
      fontSize: 34,
      ...accentColor(theme),
      mb: 1.5,
    },

    trustTitle: {
      fontWeight: 700,
      mb: 0.75,
    },

    trustDescription: {
      color: 'text.secondary',
      fontSize: 14,
      lineHeight: 1.6,
      mb: 0,
    },

    section: {
      mt: isMobile ? 5 : 7,
      textAlign: 'center',
    },

    sectionTitle: {
      textAlign: 'center',
      fontWeight: 700,
      mt: 12,
      mb: isMobile ? 3 : 5,
    },

    stepCard: {
      textAlign: 'center',
    },

    stepBadge: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mx: 'auto',
      // mb: 1.5,
      mb: 4,
      background: 'linear-gradient(135deg, rgba(0,188,212,0.18), rgba(0,96,100,0.12))',
      color: Color.cyanDark,
      fontWeight: 700,
      fontSize: 18,
      ...darkStyles(theme, {
        background: 'linear-gradient(135deg, rgba(0,188,212,0.25), rgba(0,96,100,0.2))',
        color: Color.cyan,
      }),
    },

    stepTitle: {
      fontWeight: 600,
      mb: 0.75,
    },

    stepDescription: {
      color: 'text.secondary',
      fontSize: 14,
      lineHeight: 1.6,
      mb: 0,
    },

    banksSection: {
      mt: isMobile ? 5 : 7,
    },

    bankGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1.5,
      justifyContent: 'center',
    },

    bankChip: {
      border: '1px solid rgba(0,96,100,0.2)',
      color: Color.cyanDark,
      backgroundColor: 'rgba(0,96,100,0.05)',
      fontWeight: 600,
      fontSize: 14,
      height: 38,
      ...darkStyles(theme, {
        borderColor: 'rgba(0,188,212,0.3)',
        color: Color.cyan,
        backgroundColor: 'rgba(0,188,212,0.08)',
      }),
    },
  }
}
