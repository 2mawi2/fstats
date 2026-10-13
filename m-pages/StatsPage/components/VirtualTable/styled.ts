import type { Theme } from '@mui/material/styles'

export const ui = () => {
  return {
    wrapper: {
      border: 1,
      borderColor: 'divider',
    },
    stickyWrapper: {
      borderTop: 0,
    },
    scrollWrapper: {
      overflowX: 'auto',
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
        // Opaque, so rows don't show through a sticky header
        bgcolor: 'background.default',
        backgroundImage: (theme: Theme) =>
          `linear-gradient(${theme.vars.palette.action.hover}, ${theme.vars.palette.action.hover})`,
      },
      // Collapsed borders don't move with sticky cells, so they are drawn as shadows, including the wrapper's top
      // border which would scroll away
      '& th.sticky': {
        position: 'sticky',
        zIndex: 1,
        borderBottom: 0,
        boxShadow: (theme: Theme) =>
          `inset 0 1px 0 ${theme.vars.palette.divider}, inset 0 -1px 0 ${theme.vars.palette.divider}`,
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
      // Search matches
      '& mark': (theme: Theme) => ({
        color: 'inherit',
        backgroundColor: '#fde68a',
        borderRadius: '2px',
        ...theme.applyStyles('dark', { backgroundColor: 'rgba(250, 204, 21, 0.4)' }),
      }),
    },
  }
}
