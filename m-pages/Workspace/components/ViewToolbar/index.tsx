'use client'

import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material'
import { Box, Divider, Link } from '@mui/material'
import NextLink from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'

import { useTranslation } from '@/lib/i18n'

import { getView, getViewChange, getWorkspaceHref, WorkspaceView } from '../../params'
import { ui } from './styled'

type ViewToolbarProps = {
  children?: ReactNode
}

/**
 * Toolbar of the middle column: switches between the data and stats views, followed by the view's own controls.
 */
const Component = ({ children }: ViewToolbarProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const activeView = getView(searchParams)
  const views = [
    { view: WorkspaceView.DATA, label: t('NAVIGATION.DATA') },
    { view: WorkspaceView.STATS, label: t('NAVIGATION.STATS') },
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
    </Box>
  )
}

export default Component
