import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme) => {
  return {
    button: (expanded: boolean) => ({
      py: 0.5,
      px: 1,
      mt: 1,
      borderRadius: expanded ? 2 : 1.5,
      width: '100%',
      display: 'block',
      textAlign: 'initial',
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    }),
  }
}
