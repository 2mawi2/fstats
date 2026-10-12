export const ui = () => {
  return {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      pt: 12,
      textAlign: 'center',
    },
    iconCircle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      height: 80,
      mb: 1,
      borderRadius: '50%',
      bgcolor: 'action.hover',
    },
    icon: {
      fontSize: 40,
      color: 'text.secondary',
    },
    subtitle: {
      maxWidth: 320,
    },
  }
}
