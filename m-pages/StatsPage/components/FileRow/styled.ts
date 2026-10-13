import { sxListRow, sxListRowTitle, sxSmallCheckbox } from '../../styled'

export const ui = () => {
  return {
    row: {
      ...sxListRow,
      gap: 0.75,
      pl: 1,
      pr: 1.25,
    },
    checkbox: sxSmallCheckbox,
    name: sxListRowTitle,
    status: {
      flexShrink: 0,
      fontSize: 16,
    },
    bankChip: {
      maxWidth: '45%',
    },
  }
}
