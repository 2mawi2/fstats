export const ui = () => {
  return {
    // Positioned, for the frame of the selected row
    scroll: {
      position: 'relative',
      overflowY: 'auto',
    },
    radio: {
      p: 0.25,
      '& .MuiSvgIcon-root': { fontSize: 18 },
    },
    frame: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 2,
      border: 2,
      borderColor: 'primary.main',
      borderRadius: 1,
      pointerEvents: 'none',
    },
  }
}
