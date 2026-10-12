export const ui = () => {
  return {
    item: {
      flexDirection: 'column',
      alignItems: 'stretch',
      // Extra space only separates rows, the last one ends at the card border
      '&:last-of-type .details': { pb: 1.25 },
    },
    row: {
      gap: 1,
      minHeight: 34,
      py: 0,
      pl: 1.5,
      pr: 1,
    },
    title: {
      flexGrow: 1,
      minWidth: 0,
      m: 0,
      fontSize: 13,
      lineHeight: 1.4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    // Same as the bank chip of the file rows
    chip: {
      flexShrink: 0,
      mr: 'auto',
      px: 0.75,
      border: 1,
      borderColor: 'divider',
      borderRadius: '10px',
      fontSize: 11,
      lineHeight: '18px',
      color: 'text.secondary',
    },
    balance: {
      flexShrink: 0,
      fontSize: 13,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    },
    chevron: {
      flexShrink: 0,
      fontSize: 18,
      color: 'text.secondary',
      transition: 'transform 150ms',
    },
    collapse: {
      width: '100%',
    },
    details: {
      pl: 1.5,
      pr: 1.5,
      pt: 0.5,
      pb: 2,
      fontSize: 12,
    },
  }
}
