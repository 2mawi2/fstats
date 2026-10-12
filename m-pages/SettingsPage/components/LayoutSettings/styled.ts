export const ui = () => {
  return {
    tiles: {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      gap: 2,
      // 8 of 12 columns on larger screens
      width: { xs: '100%', md: `${(8 / 12) * 100}%` },
    },

    tile: (isSelected: boolean) => ({
      position: 'relative',
      display: 'block',
      p: 2,
      textAlign: 'left',
      border: 1,
      borderColor: isSelected ? 'primary.main' : 'divider',
      borderRadius: 2,
      transition: 'border-color 0.2s',
      '&:hover': { borderColor: isSelected ? 'primary.main' : 'text.secondary' },
    }),

    check: {
      position: 'absolute',
      top: 12,
      right: 12,
      fontSize: 20,
    },

    hint: {
      display: 'block',
      mt: 2,
    },

    tileTitle: {
      mb: 1.5,
      fontWeight: 600,
      color: 'text.primary',
    },

    tileCaption: {
      mt: 1,
      color: 'text.secondary',
      fontVariantNumeric: 'tabular-nums',
    },

    diagram: {
      display: 'flex',
      gap: '3px',
      height: 96,
    },

    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
      minWidth: 0,
    },

    changed: (isChanged: boolean) => ({
      fontWeight: isChanged ? 700 : 400,
      color: isChanged ? 'text.primary' : 'text.secondary',
    }),

    block: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
      minHeight: 0,
      borderRadius: '4px',
      bgcolor: 'action.selected',
      fontSize: 11,
      color: 'text.secondary',
      fontVariantNumeric: 'tabular-nums',
    },
  }
}
