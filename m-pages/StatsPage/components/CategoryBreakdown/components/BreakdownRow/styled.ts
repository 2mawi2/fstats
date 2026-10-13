import type { Theme } from '@mui/material/styles'

export const ui = (theme: Theme) => {
  return {
    button: {
      py: 0.5,
      px: 1,
      mt: 0.25,
      borderRadius: 1,
      width: '100%',
      display: 'block',
      textAlign: 'initial',
      '&:hover': {
        backgroundColor: theme.vars.palette.action.hover,
      },
    },
  }
}
