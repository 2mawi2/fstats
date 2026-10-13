export const ui = () => {
  return {
    checkbox: {
      flexShrink: 0,
      p: 0.5,
      color: 'action.disabled',
      '& .MuiSvgIcon-root': { fontSize: 18 },
      '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: 'text.secondary' },
    },
    scroll: {
      flexGrow: 1,
      minHeight: 0,
      overflowY: 'auto',
    },
    rows: {
      position: 'relative',
    },
    row: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 0.25,
      pr: 1.25,
      cursor: 'pointer',
      userSelect: 'none',
      '&:hover': { bgcolor: 'action.hover' },
    },
    expandIcon: {
      display: 'flex',
      flexShrink: 0,
      justifyContent: 'center',
      width: 22,
      color: 'text.secondary',
      '& .MuiSvgIcon-root': { fontSize: 18, transition: 'transform 150ms' },
    },
    expandIconEnd: {
      ml: 'auto',
      '& .MuiSvgIcon-root': { fontSize: 20 },
    },
    expandSpacer: {
      flexShrink: 0,
      width: 22,
    },
    label: {
      minWidth: 0,
      fontSize: 13,
      lineHeight: 1.4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      // Same width digits, so the dates line up
      fontVariantNumeric: 'tabular-nums',
    },
    // Fixed width, so the weekdays line up like a column
    weekday: {
      flexShrink: 0,
      minWidth: 30,
      ml: 0.75,
      px: 0.5,
      borderRadius: '4px',
      bgcolor: 'action.hover',
      fontSize: 10.5,
      lineHeight: '16px',
      textAlign: 'center',
      color: 'text.secondary',
    },
    weekdayDeselected: {
      color: 'text.disabled',
    },
    // Digits only (no descenders to clip), trimmed to their height to center them with the checkbox, Roboto's line box
    // puts them slightly high
    yearLabel: {
      fontSize: 14.5,
      textBoxTrim: 'trim-both',
      textBoxEdge: 'cap alphabetic',
      // Round digits overshoot the trimmed box, years are short enough to never need the ellipsis
      overflow: 'visible',
    },
  }
}
