'use client'

import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'

import { ui } from './styled'

// The labels mostly speak for themselves, so their titles only show when hovering a while
const TITLE_DELAY = 750 // ms

type SegmentedToggleProps<T extends string> = {
  value: T
  options: { value: T; label: string; title?: string }[]
  onChange: (value: T) => void
  disabled?: boolean
  /**
   * Explains why the toggle is disabled, shown on hover.
   */
  disabledTooltip?: string
}

const Component = <T extends string>({
  value,
  options,
  onChange,
  disabled,
  disabledTooltip,
}: SegmentedToggleProps<T>) => {
  const sx = ui()

  const group = (
    <ToggleButtonGroup
      size="small"
      exclusive
      disabled={disabled}
      value={value}
      onChange={(_, next: T | null) => (next ? onChange(next) : undefined)}
      sx={sx.group(disabled)}
    >
      {options.map((option) => (
        // Disabled buttons don't fire hover events, the group's `disabledTooltip` explains them instead
        <Tooltip
          key={option.value}
          title={disabled ? '' : option.title}
          enterDelay={TITLE_DELAY}
          enterNextDelay={TITLE_DELAY}
        >
          <ToggleButton value={option.value} sx={sx.button}>
            {option.label}
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  )

  // Disabled elements don't fire hover events, so the tooltip needs a wrapper
  return disabled && disabledTooltip ? (
    <Tooltip title={disabledTooltip}>
      <Box component="span" sx={sx.tooltipWrapper}>
        {group}
      </Box>
    </Tooltip>
  ) : (
    group
  )
}

export default Component
