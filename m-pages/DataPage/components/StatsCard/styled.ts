export const ui = () => {
  return {
    card: {
      border: 1,
      borderColor: 'divider',
      borderRadius: 1,
      overflow: 'hidden',
      // The card border replaces the last row's divider
      '& > li:last-of-type': { borderBottom: 0 },
    },
  }
}
