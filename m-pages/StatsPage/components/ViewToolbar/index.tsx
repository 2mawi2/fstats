'use client'

import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material'
import { Box, Divider, Link } from '@mui/material'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'

import { useTranslation } from '@/lib/i18n'

import { getView, getViewChange, getWorkspaceHref, WorkspaceView } from '../../params'
import type { FilterOption } from '../Filters'
import Filters from '../Filters'
import { ui } from './styled'

type ViewToolbarProps = {
  children?: ReactNode
  /**
   * On the right, next to the filters, e.g. a search field.
   */
  end?: ReactNode
  /**
   * Switches of the transactions table.
   */
  options?: FilterOption[]
}

/**
 * Toolbar of the middle column: switches between the CSV, transactions, breakdown and stats views (raw to most summarised), followed by the view's own controls
 * and the filters.
 */
const Component = ({ children, end, options }: ViewToolbarProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const activeView = getView(searchParams)
  const views = [
    { view: WorkspaceView.CSV, label: t('STATS_PAGE.VIEW.CSV') },
    { view: WorkspaceView.TRANSACTIONS, label: t('STATS_PAGE.VIEW.TRANSACTIONS') },
    { view: WorkspaceView.BREAKDOWN, label: t('STATS_PAGE.VIEW.BREAKDOWN') },
    { view: WorkspaceView.STATS, label: t('STATS_PAGE.VIEW.STATS') },
  ]

  return (
    <Box sx={sx.toolbar}>
      <Box component="nav" sx={sx.views}>
        {views.map(({ view, label }) => {
          const isActive = view === activeView

          return (
            <Link
              key={view}
              component={NextLink}
              // Keeps e.g. demo mode when switching
              href={getWorkspaceHref(searchParams, getViewChange(view))}
              underline="none"
              aria-current={isActive ? 'page' : undefined}
              sx={isActive ? { ...sx.view, ...sx.activeView } : sx.view}
            >
              {isActive ? <RadioButtonChecked sx={sx.radio} /> : <RadioButtonUnchecked sx={sx.radio} />}
              <Box component="span" data-label={label} sx={sx.label}>
                <span>{label}</span>
              </Box>
            </Link>
          )
        })}
      </Box>
      {children ? <Divider orientation="vertical" flexItem sx={sx.divider} /> : null}
      {children}
      <Box sx={sx.spacer} />
      {end}
      {/* On every view, so the toolbar doesn't change when switching */}
      <Filters options={options ?? []} />
    </Box>
  )
}

export default Component
