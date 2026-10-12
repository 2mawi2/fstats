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
    // Toolbar on top, content scrolls below it
    toolbarColumn: {
      display: 'flex',
      flexDirection: 'column',
      p: 0,
    },
    // Same height as the file toolbar of the left column
    middleToolbar: {
      flexShrink: 0,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 1,
      minHeight: 40,
      px: 2,
      py: 0.5,
      borderBottom: 1,
      borderColor: 'divider',
    },
    middleScroll: {
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
      p: 2,
    },
    duplicatesSwitch: {
      ml: 'auto',
      mr: 0,
    },
    rightColumn: {
      p: 1.5,
    },
    rightSubheader: {
      px: 0.5,
      pt: 2,
      pb: 0.75,
      fontSize: 11,
      fontWeight: 'medium',
      lineHeight: 1.5,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'text.secondary',
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
