export const ui = () => {
  return {
    row: {
      gap: 0.75,
      minHeight: 34,
      py: 0,
      pl: 1,
      pr: 1.25,
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
      flexShrink: 0,
      fontSize: 16,
    },
    bankChip: {
      maxWidth: '45%',
    },
  }
}
