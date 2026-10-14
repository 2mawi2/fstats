'use client'

import { ArrowDropDown } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { useState } from 'react'

import { useTranslation } from '@/lib/i18n'

import DropdownMenu, { DropdownMenuItem } from '../../../DropdownMenu'
import { ui } from './styled'

export type FormatOption = {
  value: string
  /**
   * E.g. an example date in the format.
   */
  label: string
  /**
   * The values of the column can be read with it.
   */
  isMatch?: boolean
  /**
   * In the menu, after the label (e.g. the name of a currency).
   */
  description?: string
  /**
   * In the menu, aligned right (e.g. the symbol of a currency).
   */
  end?: string
  /**
   * On the button, the label by default.
   */
  buttonLabel?: string
}

type FormatSelectProps = {
  /**
   * Of the button, also shown without a value.
   */
  title: string
  value: string
  options: FormatOption[]
  /**
   * The format doesn't match the column.
   */
  isError?: boolean
  onChange: (value: string) => void
}

/**
 * Compact menu of formats (e.g. of dates or numbers), the ones matching the column are marked.
 */
const Component = ({ title, value, options, isError = false, onChange }: FormatSelectProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const selected = options.find((option) => option.value === value)

  const select = (option: string) => {
    onChange(option)
    setAnchor(null)
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        color={isError ? 'error' : 'inherit'}
        endIcon={<ArrowDropDown />}
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={title}
        title={title}
        aria-haspopup="menu"
        aria-expanded={anchor ? true : undefined}
        sx={{ ...sx.button, ...(isError ? sx.errorButton : null) }}
      >
        {selected ? (selected.buttonLabel ?? selected.label) : title}
      </Button>
      <DropdownMenu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            selected={option.value === value}
            onClick={() => select(option.value)}
            title={option.value}
            label={
              <Box component="span" sx={sx.option}>
                <Box component="span" sx={option.description ? sx.code : undefined}>
                  {option.label}
                </Box>
                {option.description ? (
                  <Box component="span" sx={sx.description}>
                    {option.description}
                  </Box>
                ) : null}
                {option.isMatch ? (
                  <Box component="span" sx={sx.matches}>
                    {t('STATS_PAGE.PARSER_SETUP.CONNECTOR.MATCHES')}
                  </Box>
                ) : null}
                {option.end ? (
                  <Box component="span" sx={sx.end}>
                    {option.end}
                  </Box>
                ) : null}
              </Box>
            }
          />
        ))}
      </DropdownMenu>
    </>
  )
}

export default Component
