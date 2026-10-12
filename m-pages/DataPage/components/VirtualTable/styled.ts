export const ui = () => {
  return {
    wrapper: {
      border: 1,
      borderColor: 'divider',
    },
    table: {
      // Fixed layout, so column widths don't change as rows are virtualized
      tableLayout: 'fixed',
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 12,
      '& th, & td': {
        px: 1,
        py: 0.5,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'left',
        borderBottom: 1,
        borderColor: 'divider',
      },
      '& th': {
        fontWeight: 'medium',
        bgcolor: 'action.hover',
      },
      '& tr.spacer td': {
        p: 0,
        border: 0,
      },
      '& tbody tr:last-of-type td': {
        borderBottom: 0,
      },
      '& tbody tr:not(.spacer):hover': {
        bgcolor: 'action.hover',
      },
    },
  }
}
