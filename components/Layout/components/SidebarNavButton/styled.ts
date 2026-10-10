import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme, isActive: boolean) => {
  return {
    button: {
      display: 'flex',
      justifyContent: 'flex-start',
      width: '100%',
      height: 48,
      borderRadius: '8px',
      overflow: 'hidden',
      color: isActive ? theme.vars.palette.primary.main : theme.vars.palette.secondary.main,
      backgroundColor: isActive ? theme.vars.palette.action.hover : 'transparent',
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    },

    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 48,
      height: 48,
    },

    label: (expanded: boolean) => ({
      fontSize: 14,
      fontWeight: isActive ? 'bold' : 'normal',
      pr: 1.5,
      opacity: expanded ? 1 : 0,
      transition: 'opacity 0.2s',
    }),
  }
}
