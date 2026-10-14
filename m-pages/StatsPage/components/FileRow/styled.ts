import { sxListRow, sxListRowTitle, sxSmallCheckbox } from '../../styled'

export const ui = () => {
  return {
    row: {
      ...sxListRow,
      gap: 0.75,
      pl: 1,
      pr: 1.25,
      minWidth: 0,
    },
    checkbox: sxSmallCheckbox,
    name: sxListRowTitle,
    status: {
      flexShrink: 0,
      fontSize: 16,
    },
    setupButton: {
      flexShrink: 0,
      minWidth: 0,
      mr: 1.25,
      py: 0,
      px: 1,
      fontSize: 12,
      lineHeight: 1.6,
    },
    bankChip: {
      maxWidth: '45%',
    },
  }
}
