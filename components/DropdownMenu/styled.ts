export const ui = () => {
  return {
    menu: {
      '& .MuiMenu-paper': {
        minWidth: 180,
        maxWidth: 300,
        borderRadius: '6px',
        border: 1,
        borderColor: 'divider',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      '& .MuiMenu-list': {
        py: 0.5,
      },
    },
    item: {
      minHeight: 0,
      m: 0,
      py: 0.5,
      px: 1.5,
      gap: 1,
      fontSize: 14,
      lineHeight: 1.4,
      '&.Mui-selected': { fontWeight: 600 },
    },
    label: {
      flexGrow: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    count: {
      fontSize: 12,
      fontWeight: 400,
      color: 'text.secondary',
      fontVariantNumeric: 'tabular-nums',
    },
    divider: {
      my: '4px !important',
    },
    subheader: {
      px: 1.5,
      py: 0.5,
      fontSize: 11,
      fontWeight: 'medium',
      lineHeight: 1.5,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'text.secondary',
      bgcolor: 'transparent',
      position: 'static',
    },
  }
}
