export const ui = () => {
  return {
    // Like the labels of the currency and number format, see `AmountFormats`
    label: {
      fontSize: 14,
    },
    toggle: {
      flexShrink: 0,
      minWidth: 0,
      px: 1,
    },
    picker: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 0.75,
      mt: 1,
      // The table uses the full width
      '& > :not(button)': { alignSelf: 'stretch' },
    },
    hint: {
      fontSize: 13,
      color: 'text.secondary',
    },
  }
}
