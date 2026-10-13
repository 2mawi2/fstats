'use client'

import { createSvgIcon } from '@mui/material/utils'

// Same outline as `CheckBoxOutlineBlank`
const OUTLINE = 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'

/**
 * Outlined versions of the checked and indeterminate checkbox icons, lighter than the filled defaults.
 */
export const CheckBoxOutlineChecked = createSvgIcon(
  <>
    <path d={OUTLINE} />
    <path d="M7.5 12.25l3 3 6-6" fill="none" stroke="currentColor" strokeWidth={2} />
  </>,
  'CheckBoxOutlineChecked',
)

export const CheckBoxOutlineIndeterminate = createSvgIcon(
  <>
    <path d={OUTLINE} />
    <path d="M8 12h8" fill="none" stroke="currentColor" strokeWidth={2} />
  </>,
  'CheckBoxOutlineIndeterminate',
)
