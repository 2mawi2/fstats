'use client'

import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material'
import { Box, Divider, Link } from '@mui/material'
import NextLink from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import type { ReactNode } from 'react'

import { ROUTES } from '@/common'
import { useTranslation } from '@/lib/i18n'

import { ui } from './styled'

type ViewToolbarProps = {
  children?: ReactNode
}

/**
 * Toolbar of the middle column: switches between the data and stats pages, followed by the page's own controls.
 */
const Component = ({ children }: ViewToolbarProps) => {
  const sx = ui()
  const { t } = useTranslation()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Keeps e.g. demo mode when switching
  const query = searchParams.toString()
  const views = [
    { route: ROUTES.DATA, label: t('NAVIGATION.DATA') },
    { route: ROUTES.STATS, label: t('NAVIGATION.STATS') },
  ]

  return (
    <Box sx={sx.toolbar}>
      <Box component="nav" sx={sx.views}>
        {views.map(({ route, label }) => {
          const isActive = pathname === route

          return (
            <Link
              key={route}
              component={NextLink}
              href={query ? `${route}?${query}` : route}
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
