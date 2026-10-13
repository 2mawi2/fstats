// Same sizes as the date explorer's rows
export const ui = () => {
  return {
    // Fills the pane, so the tooltip shows anywhere in it
    skeleton: {
      flexGrow: 1,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.25,
      pr: 1.25,
    },
    expandIcon: {
      display: 'flex',
      flexShrink: 0,
      justifyContent: 'center',
      width: 22,
      color: 'action.disabled',
      '& .MuiSvgIcon-root': { fontSize: 18 },
    },
    expandIconEnd: {
      ml: 'auto',
      '& .MuiSvgIcon-root': { fontSize: 20 },
    },
    expandSpacer: {
      flexShrink: 0,
      width: 22,
    },
    checkbox: {
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: 26,
    },
    // The theme's radius would make it a circle
    checkboxBox: {
      borderRadius: '2px',
    },
  }
}
