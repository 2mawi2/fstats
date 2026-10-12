export const ui = () => {
  return {
    // Same height as the file toolbar of the left column
    toolbar: {
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
    views: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    },
    view: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      fontSize: 13,
      color: 'text.secondary',
      '&:hover': { color: 'text.primary' },
    },
    activeView: {
      fontWeight: 700,
      color: 'text.primary',
    },
    // Always as wide as the wider of the regular and bold label (either can be wider due to kerning), so selecting a
    // view doesn't shift the layout. The hidden copies and the text share one grid cell.
    label: {
      display: 'inline-grid',
      '& > *, &::before, &::after': { gridArea: '1 / 1' },
      '&::before, &::after': {
        content: 'attr(data-label)',
        visibility: 'hidden',
        userSelect: 'none',
        pointerEvents: 'none',
      },
      '&::before': { fontWeight: 400 },
      '&::after': { fontWeight: 700 },
    },
    radio: {
      fontSize: 16,
    },
    divider: {
      mx: 0.5,
      my: 0.5,
    },
  }
}
