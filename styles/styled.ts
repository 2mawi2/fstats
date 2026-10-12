import type { Theme } from '@mui/material/styles'

export const sxMenuPaper = (theme: Theme, isMobile = false) => {
  return {
    px: 1,
    marginTop: 0.5,
    maxHeight: isMobile ? '40%' : '50%',
    border: `1px solid ${theme.vars.palette.divider}`,
    boxShadow: `0 1px 1px hsl(0deg 0% 0% / 0.075),
                0 2px 2px hsl(0deg 0% 0% / 0.075),
                0 4px 4px hsl(0deg 0% 0% / 0.075)`,
  }
}

export const sxMenuItem = (isLastItem = false) => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    p: 1,
    mb: isLastItem ? 0 : 0.5,
    borderRadius: 1,
    textAlign: 'left',
    whiteSpace: 'normal',
  }
}

/**
 * Bordered, clickable tile, e.g. for settings options.
 */
export const sxTile = (isSelected = false) => {
  return {
    display: 'block',
    p: 2,
    textAlign: 'left',
    border: 1,
    borderColor: isSelected ? 'primary.main' : 'divider',
    borderRadius: 2,
    transition: 'border-color 0.2s',
    '&:hover': { borderColor: isSelected ? 'primary.main' : 'text.secondary' },
  }
}
