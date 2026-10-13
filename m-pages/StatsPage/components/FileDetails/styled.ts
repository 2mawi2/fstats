export const ui = () => {
  return {
    info: {
      mb: 1.5,
      fontSize: 12,
      lineHeight: 1.5,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.5,
      mb: 0.75,
    },
    chip: {
      height: 22,
      fontSize: 12,
      '& .MuiChip-icon': { fontSize: 14, ml: 0.75 },
      '& .MuiChip-label': { px: 0.75 },
    },
    status: {
      mb: 0.5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    meta: {
      color: 'text.secondary',
    },
  }
}
