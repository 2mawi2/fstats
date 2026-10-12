export const ui = () => {
  return {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      pt: 8,
    },
    // Padded, so the hover effect starts before the pointer reaches the icon
    content: (isClickable: boolean) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      width: '100%',
      maxWidth: 560,
      px: 4,
      py: 8,
      textAlign: 'center',
      ...(isClickable && {
        cursor: 'pointer',
        '&:hover .empty-icon-circle': { bgcolor: 'action.selected', transform: 'scale(1.08)' },
        '&:hover .empty-icon': { color: 'primary.main' },
      }),
    }),
    iconCircle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      height: 80,
      mb: 1,
      borderRadius: '50%',
      bgcolor: 'action.hover',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    icon: {
      fontSize: 40,
      color: 'text.secondary',
      transition: 'color 0.2s',
    },
    subtitle: {
      maxWidth: 320,
    },
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 1.5,
      mt: 2,
    },
  }
}
