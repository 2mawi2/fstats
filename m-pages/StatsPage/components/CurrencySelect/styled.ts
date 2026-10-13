export const ui = () => {
  return {
    // Like the toolbar, spaced like its views
    options: {
      flexShrink: 0,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 2,
      minHeight: 36,
      px: 2,
      py: 0.5,
      borderBottom: 1,
      borderColor: 'divider',
    },
  }
}
