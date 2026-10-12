export const ui = () => {
  return {
    // Fills the viewport: the demo banner on top, the columns below it
    dropzone: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    },
    container: {
      display: 'flex',
      flexGrow: 1,
      minHeight: 0,
      width: '100%',
    },
    column: {
      minWidth: 0,
      overflow: 'auto',
      p: 2,
    },
    divider: {
      position: 'relative',
      zIndex: 1,
      flexShrink: 0,
      width: '1px',
      cursor: 'col-resize',
      bgcolor: 'divider',
      touchAction: 'none',
      // Wider hit zone, centered on the line
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: -3,
        right: -3,
      },
      '&:hover::before, &:active::before': { bgcolor: 'action.hover' },
    },
    // With its own scroll container
    fullHeightColumn: {
      height: '100%',
    },
    // Toolbar on top, content scrolls below it
    toolbarColumn: {
      display: 'flex',
      flexDirection: 'column',
      p: 0,
    },
    rightColumn: {
      p: 1.5,
    },
  }
}
