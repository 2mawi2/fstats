const HOVER_BACKGROUND = 'rgba(255, 255, 255, 0.1)'

export const ui = (isMobile: boolean) => {
  return {
    banner: {
      backgroundColor: '#000',
      color: '#fff',
      // Edge to edge above the columns
      flexShrink: 0,
      py: 0.5,
      px: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 1.5 : 0,
    },
    text: {
      fontWeight: 500,
      mb: 0,
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    uploadButton: {
      color: '#fff',
      borderColor: '#fff',
      '&:hover': {
        borderColor: '#fff',
        backgroundColor: HOVER_BACKGROUND,
      },
    },
    closeButton: {
      color: '#fff',
      '&:hover': {
        backgroundColor: HOVER_BACKGROUND,
      },
    },
  }
}
