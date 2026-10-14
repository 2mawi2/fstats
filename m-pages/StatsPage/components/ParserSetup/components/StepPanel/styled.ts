export const ui = () => {
  return {
    // Forms stay readable in a wide column, the tables above use the full width
    panel: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2.5,
      maxWidth: 760,
    },
    fullWidth: {
      maxWidth: 'none',
    },
    title: {
      m: 0,
      fontSize: 16,
      fontWeight: 'medium',
    },
    hint: {
      mt: 0.5,
      fontSize: 13,
      color: 'text.secondary',
    },
    // Apart from the form above, so it's clear they apply to the whole step
    actions: {
      mt: 0.5,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
    },
  }
}
