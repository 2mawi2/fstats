'use client'

import { ToggleButton, ToggleButtonGroup } from '@mui/material'

import { ui } from './styled'

type SegmentedToggleProps<T extends string> = {
  value: T
  options: { value: T; label: string; title?: string }[]
  onChange: (value: T) => void
  disabled?: boolean
}

const Component = <T extends string>({ value, options, onChange, disabled }: SegmentedToggleProps<T>) => {
  const sx = ui()

  return (
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
}

export default Component
