export const ui = () => {
  return {
    item: (expanded: boolean) => ({
      display: 'block',
      bgcolor: expanded ? 'action.hover' : 'transparent',
      // Chevron only on hover (or while expanded), always on touch devices
      '& .chevron:not(.expanded)': { display: 'none' },
      '&:hover .chevron, & .chevron:focus-visible': { display: 'inline-flex' },
      '@media (hover: none)': { '& .chevron:not(.expanded)': { display: 'inline-flex' } },
    }),
    row: {
      gap: 0.75,
      minHeight: 34,
      py: 0,
      pl: 1,
      pr: 0.5,
    },
    checkbox: {
      p: 0.5,
      '& .MuiSvgIcon-root': { fontSize: 18 },
    },
    name: {
      flexGrow: 1,
      minWidth: 0,
      m: 0,
      fontSize: 13,
      lineHeight: 1.4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    status: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    statusButton: {
      p: 0.5,
      '& .MuiSvgIcon-root': { fontSize: 16 },
    },
    bankChip: {
      flexShrink: 0,
      maxWidth: '45%',
      px: 0.75,
      border: 1,
      borderColor: 'divider',
      borderRadius: '10px',
      fontSize: 11,
      lineHeight: '18px',
      color: 'text.secondary',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    chevronButton: {
      flexShrink: 0,
      p: 0.5,
      color: 'text.secondary',
      '& .MuiSvgIcon-root': { fontSize: 18 },
    },
    details: {
      pl: 5,
      pr: 0.5,
      pb: 0.5,
      fontSize: 12,
      lineHeight: 1.5,
    },
    format: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    meta: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      color: 'text.secondary',
    },
  }
}
