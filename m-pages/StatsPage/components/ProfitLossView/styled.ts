export const ui = () => {
  return {
    // Own scroll container below the toolbar, like the stats view
    scroll: {
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
    },
    section: {
      p: 2,
    },
  }
}
