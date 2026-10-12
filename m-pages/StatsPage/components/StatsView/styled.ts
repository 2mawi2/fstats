export const ui = () => {
  return {
    // Own scroll container below the toolbar, like the data view
    scroll: {
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
    },
    // Padded per section, so the dividers between them go edge to edge
    section: {
      p: 2,
    },
  }
}
