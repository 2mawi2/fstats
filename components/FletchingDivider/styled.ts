export const ui = () => {
  return {
    // Tall enough for the strokes, with more space around it than a `Divider`
    divider: {
      position: 'relative',
      height: 24,
      my: 2,
      // The line, full width
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        borderTop: 1,
        borderColor: 'divider',
      },
    },
    // Rotated around the end on the line, so the other end touches the edge: up or down by 45°
    stroke: (side: 'start' | 'end', direction: 'up' | 'down') => {
      const angle = (side === 'start') === (direction === 'up') ? 45 : -45

      return {
        position: 'absolute',
        top: '50%',
        borderTop: 1,
        borderColor: 'divider',
        transformOrigin: side === 'start' ? 'right center' : 'left center',
        transform: `rotate(${angle}deg)`,
      }
    },
  }
}
