export const ui = () => {
  return {
    circle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: 20,
      borderRadius: '50%',
      bgcolor: 'action.disabled',
      color: 'background.default',
      fontSize: 12,
      lineHeight: 1,
      transition: 'background-color 150ms',
    },
    active: {
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
    },
    completed: {
      bgcolor: 'text.secondary',
    },
    check: {
      fontSize: 14,
    },
  }
}
