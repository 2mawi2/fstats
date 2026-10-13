'use client'

import type { CheckboxProps } from '@mui/material'
import { Checkbox } from '@mui/material'

import { CheckBoxOutlineChecked, CheckBoxOutlineIndeterminate } from './icons'

/**
 * Small checkbox with outlined icons and muted colors, for the rows of the date explorer and the filters.
 */
const Component = ({ sx, ...props }: CheckboxProps) => {
  return (
    <Checkbox
      size="small"
      checkedIcon={<CheckBoxOutlineChecked />}
      indeterminateIcon={<CheckBoxOutlineIndeterminate />}
      {...props}
      sx={{
        flexShrink: 0,
        p: 0.5,
        color: 'action.disabled',
        '& .MuiSvgIcon-root': { fontSize: 18 },
        '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: 'text.secondary' },
        ...sx,
      }}
    />
  )
}

export default Component
