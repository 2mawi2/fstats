import { pick } from 'lodash'

import { ui as explorerUi } from '../DateExplorer/styled'

/**
 * The date explorer's row layout, static and greyed out.
 */
export const ui = () => {
  const { row, expandIcon, expandIconEnd, expandSpacer } = explorerUi()

  return {
    // Fills the pane, so the tooltip shows anywhere in it
    skeleton: {
      flexGrow: 1,
    },
    // Only the layout, not the positioning and hover of the virtual rows
    row: pick(row, ['display', 'alignItems', 'gap', 'pr']),
    expandIcon: {
      ...expandIcon,
      color: 'action.disabled',
    },
    expandIconEnd,
    expandSpacer,
    // Same size as the checkbox, its padding and icon
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
