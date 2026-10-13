export const ui = () => {
  return {
    // Own scroll container below the toolbar, like the stats view
    scroll: {
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
    },
    // Same padding as the transactions view
    section: {
      p: 2,
      // Below a currency divider as much space as above it, where the padding adds to the margin of the preview section
      '[role="separator"] + &': { pt: 5 },
    },
  }
}
