export const ui = () => {
  return {
    wizard: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
      pt: 1,
    },
    table: {
      tableLayout: 'fixed',
      '& .MuiTableCell-root': { px: 0.5, fontSize: 12 },
      '& .MuiTableCell-head': { color: 'text.secondary', fontWeight: 'medium' },
    },
    headerCell: {
      width: '45%',
    },
    fieldCell: {
      py: 0.5,
    },
    ellipsis: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    sample: {
      fontSize: 11,
      color: 'text.secondary',
    },
    fieldSelect: {
      '& .MuiSelect-select': { py: 0.5, fontSize: 12 },
    },
    settings: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
      gap: 1,
    },
    saveRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1,
    },
  }
}
