'use client'

import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'

import { ui } from './styled'

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
        <ToggleButton key={option.value} value={option.value} title={option.title} sx={sx.button}>
          {option.label}
        </ToggleButton>
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
