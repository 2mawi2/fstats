import type { Theme } from '@mui/material/styles'

export const ui = () => {
  return {
    // Small, e.g. inside the row of the date field
    button: {
      flexShrink: 0,
      minWidth: 0,
      py: 0,
      pl: 1,
      pr: 0.5,
      fontSize: 12,
      lineHeight: '24px',
      borderColor: 'divider',
      '& .MuiButton-endIcon': { ml: 0.25 },
    },
    // A second pixel of border as a shadow, so the button doesn't grow
    errorButton: {
      borderColor: 'error.main',
      boxShadow: (theme: Theme) => `inset 0 0 0 1px ${theme.vars.palette.error.main}`,
      fontWeight: 600,
    },
    // Label, description and match on the left, the end on the right
    option: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 1,
      width: '100%',
    },
    // Codes, e.g. of currencies, are what's scanned for
    code: {
      flexShrink: 0,
      minWidth: 36,
      fontWeight: 600,
    },
    description: {
      minWidth: 0,
      fontSize: 13,
      color: 'text.secondary',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    matches: {
      fontSize: 12,
      color: 'success.main',
    },
    end: {
      flexShrink: 0,
      ml: 'auto',
      pl: 2,
      color: 'text.secondary',
    },
  }
}
