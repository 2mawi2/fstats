export const ui = () => {
  return {
    dropzone: {
      position: 'relative',
    },
    container: {
      display: 'flex',
      width: '100%',
      minHeight: '100vh',
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
    // Stays in place while the page scrolls, with its own scroll container
    stickyColumn: {
      height: '100vh',
      position: 'sticky',
      top: 0,
    },
    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      p: 0,
    },
    middleToolbar: {
      position: 'sticky',
      top: -16, // Column padding, so it sticks to the very top
      zIndex: 2,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      mt: -2,
      mb: 1,
      py: 1,
      pt: 2,
      bgcolor: 'background.default',
    },
    dropOverlay: {
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      border: 2,
      borderStyle: 'dashed',
      borderColor: 'primary.main',
      bgcolor: 'action.selected',
      backdropFilter: 'blur(2px)',
      pointerEvents: 'none',
    },
  }
}
