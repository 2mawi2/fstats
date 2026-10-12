import { ui as dataPageUi } from '@/m-pages/DataPage/styled'

export const ui = () => {
  const { dropzone, container, column, divider, stickyColumn, toolbarColumn, rightColumn } = dataPageUi()

  return {
    dropzone,
    container,
    column,
    divider,
    stickyColumn,
    toolbarColumn,
    rightColumn,
    // Own scroll container, like the middle column of the data page
    middleColumn: {
      overflowY: 'auto',
      p: 0,
    },
    // Padded per section, so the dividers between them go edge to edge
    section: {
      p: 2,
    },
  }
}
