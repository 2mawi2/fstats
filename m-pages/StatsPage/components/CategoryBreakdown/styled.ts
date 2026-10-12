export const ui = () => {
  return {
    tableHeader: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      height: '100%',
      fontSize: 12,
      fontWeight: 'medium',
      color: 'text.secondary',
      cursor: 'pointer',
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
    },

    tableHeaderContent: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    },
  }
}
