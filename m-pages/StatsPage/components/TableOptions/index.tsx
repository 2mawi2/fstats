'use client'

import { TuneOutlined } from '@mui/icons-material'
import { Badge, Box, IconButton, Switch, Tooltip } from '@mui/material'
import { useState } from 'react'

import { DropdownMenu, DropdownMenuItem } from '@/components'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

export type TableOption = {
  key: string
  label: string
  /**
   * Transactions the option applies to, disabled without any.
   */
  count: number
  checked: boolean
  onChange: (checked: boolean) => void
}

type TableOptionsProps = {
  options: TableOption[]
  disabled?: boolean
  /**
   * Explains why the button is disabled, shown on hover.
   */
  disabledTooltip?: string
}

/**
 * Settings button on the right of the toolbar, with a menu of switches for the transactions table. Marked while an
 * option is on.
 */
const Component = ({ options, disabled = false, disabledTooltip }: TableOptionsProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const isActive = options.some((option) => option.checked && option.count)

  return (
    <>
      <Tooltip title={disabled && disabledTooltip ? disabledTooltip : t('STATS_PAGE.DATA_VIEW.TABLE_OPTIONS')}>
        {/* Disabled buttons don't fire hover events */}
        <Box component="span" sx={sx.button}>
          <IconButton
            size="small"
            disabled={disabled}
            onClick={(event) => setAnchor(event.currentTarget)}
            aria-label={t('STATS_PAGE.DATA_VIEW.TABLE_OPTIONS')}
            aria-haspopup="menu"
            aria-expanded={anchor ? true : undefined}
          >
            <Badge variant="dot" color="primary" invisible={disabled || !isActive}>
              <TuneOutlined sx={sx.icon} />
            </Badge>
          </IconButton>
        </Box>
      </Tooltip>
      <DropdownMenu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {options.map((option) => (
          <DropdownMenuItem
            key={option.key}
            disabled={!option.count}
            onClick={() => option.onChange(!option.checked)}
            role="menuitemcheckbox"
            aria-checked={option.checked}
            start={<Switch size="small" checked={option.checked && !!option.count} tabIndex={-1} sx={sx.switch} />}
            label={option.label}
            count={option.count}
          />
        ))}
      </DropdownMenu>
    </>
  )
}

export default Component
