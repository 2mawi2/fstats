export const ui = () => {
  return {
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
