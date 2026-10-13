export const ui = () => {
  return {
    // On the right of the toolbar
    button: {
      mr: -0.75,
    },
    icon: {
      fontSize: 18,
    },
    // Smaller than the small switch, to fit the compact menu items
    switch: {
      width: 32,
      height: 20,
      p: 0.5,
      ml: -0.5,
      // The item handles the click
      pointerEvents: 'none',
      '& .MuiSwitch-switchBase': { p: 0.5 },
      '& .MuiSwitch-switchBase.Mui-checked': { transform: 'translateX(12px)' },
      '& .MuiSwitch-thumb': { width: 12, height: 12 },
    },
  }
}
