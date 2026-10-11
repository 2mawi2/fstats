export const ui = () => {
  return {
    section: {
      mb: 3,
    },
    title: {
      mb: 1,
      fontWeight: 'medium',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    list: {
      m: 0,
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 2,
      py: 0.75,
      borderBottom: 1,
      borderColor: 'divider',
    },
    label: {
      m: 0,
    },
    value: {
      m: 0,
      fontWeight: 'medium',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
    },
  }
}
