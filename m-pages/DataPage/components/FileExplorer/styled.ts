export const ui = () => {
  return {
    explorer: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minHeight: 0,
    },
    panes: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minHeight: 0,
    },
    pane: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      overflowY: 'auto',
      p: 1.5,
    },
    filesPane: {
      p: 0,
    },
    dropTip: {
      display: 'block',
      fontSize: 12,
      px: 2,
      py: 1.5,
    },
    splitDivider: {
      position: 'relative',
      zIndex: 1,
      flexShrink: 0,
      height: '1px',
      cursor: 'row-resize',
      bgcolor: 'divider',
      touchAction: 'none',
      // Wider hit zone, centered on the line
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        top: -3,
        bottom: -3,
      },
      '&:hover::before, &:active::before': { bgcolor: 'action.hover' },
    },
  }
}
