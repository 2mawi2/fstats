'use client'

import { ExpandMore } from '@mui/icons-material'
import { Box, Collapse, ListItem, ListItemButton, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useState } from 'react'

import type { Transaction } from '@/types'
import type { Currency } from '@/types-enums'
import { useUserPreferences } from '@/hooks'
import { toFixedLocaleCurrency } from '@/utils/Number'
import { getStats } from '@/utils/Stats'

import { getAmountColor } from '../../actions'
import StatsList from '../StatsList'
import { ui } from './styled'

type StatsRowProps = {
  title: string
  titleColor?: string
  /**
   * Bold, for the totals of all files.
   */
  isTotal?: boolean
  /**
   * `null` for files without transactions, e.g. unsupported ones.
   */
  stats: { transactions: Transaction[]; currency: Currency } | null
  /**
   * Small label next to the title, e.g. the currency.
   */
  chip?: string
  /**
   * Shown after the transaction count, e.g. "5 duplicates excluded".
   */
  notes?: string[]
  defaultExpanded?: boolean
  /**
   * Shown above the stats when expanded.
   */
  children?: ReactNode
}

/**
 * One row with the balance, expands to show the details. Styled like the file rows of the left column.
 */
const Component = ({
  title,
  titleColor = 'text.primary',
  isTotal = false,
  stats,
  chip,
  notes,
  defaultExpanded = false,
  children,
}: StatsRowProps) => {
  const sx = ui()
  const { locale } = useUserPreferences()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const profit = stats ? getStats(stats.transactions).profit : null

  return (
    <ListItem disablePadding divider sx={sx.item}>
      <ListItemButton onClick={() => setIsExpanded((prev) => !prev)} aria-expanded={isExpanded} sx={sx.row}>
        <Typography
          sx={{ ...sx.title, flexGrow: chip ? 0 : 1, color: titleColor, fontWeight: isTotal || isExpanded ? 700 : 400 }}
          title={title}
        >
          {title}
        </Typography>
        {chip ? (
          <Box component="span" sx={sx.chip}>
            {chip}
          </Box>
        ) : null}
        {/* The expanded details show it as their total */}
        {stats && profit !== null && !isExpanded ? (
          <Typography sx={{ ...sx.balance, color: getAmountColor(profit) }}>
            {toFixedLocaleCurrency(profit, stats.currency, locale)}
          </Typography>
        ) : null}
        <ExpandMore sx={{ ...sx.chevron, transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
      </ListItemButton>
      <Collapse in={isExpanded} unmountOnExit sx={sx.collapse}>
        <Box className="details" sx={sx.details}>
          {children}
          {stats ? <StatsList transactions={stats.transactions} currency={stats.currency} notes={notes} /> : null}
        </Box>
      </Collapse>
    </ListItem>
  )
}

export default Component
