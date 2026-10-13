// Same as a VirtualTable row
export const ui = () => {
  return {
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      px: 1,
      py: 0.5,
      border: 1,
      borderColor: 'divider',
      fontSize: 12,
    },
    icon: {
      flexShrink: 0,
      fontSize: 14,
    },
    message: {
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }
}
