import { blueGrey, grey } from '@mui/material/colors'
import type { Theme } from '@mui/material/styles'

import { trispace } from '@/styles/fonts'

export const ui = (theme: Theme, isMobile: boolean, isDarkMode: boolean) => {
  return {
    uploadIcon: {
      fontSize: 48,
      mb: 1,
      opacity: 0.7,
    },

    dropZoneBox: (isDragActive: boolean) => ({
      border: `2px dashed ${isDragActive ? theme.vars.palette.primary.main : isDarkMode ? blueGrey[700] : grey[300]}`,
      borderRadius: 2,
      padding: isMobile ? theme.spacing(4) : theme.spacing(6),
      textAlign: 'center' as const,
      color: isDarkMode ? grey[300] : grey[800],
      fontFamily: trispace.style.fontFamily,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      backgroundColor: isDragActive ? theme.vars.palette.action.selected : 'transparent',
      WebkitTapHighlightColor: 'transparent',

      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
        borderColor: theme.vars.palette.primary.light,
      },
    }),
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Full viewport height minus the column padding
      minHeight: 'calc(100vh - 32px)',
    },
    dropZone: {
      width: '100%',
      maxWidth: 560,
    },
    subtitle: {
      mb: 1,
    },
    folderLink: {
      verticalAlign: 'baseline',
      mb: 0,
    },
  }
}
