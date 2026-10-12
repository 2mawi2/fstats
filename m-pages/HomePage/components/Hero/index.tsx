'use client'

import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

import { ROUTES } from '@/common'
import { getDemoHref, WorkspaceView } from '@/m-pages/StatsPage/params'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { Trans, useTranslation } from '@/lib/i18n'

import { ui } from './styled'

type HeroProps = {
  titleKey: string
  subtitle: string
  ctaLabel: string
}

/**
 * Logo, title with accent, subtitle and the "get started" / demo buttons.
 */
const Component = ({ titleKey, subtitle, ctaLabel }: HeroProps) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const theme = useTheme()
  const sx = ui(theme, isMobile)

  return (
    <Box sx={sx.hero}>
      <Box component="img" src={isDarkMode ? '/img/logo-dark.svg' : '/img/logo.svg'} alt="fstats" sx={sx.logo} />

      <Typography variant="h1" sx={sx.title}>
        <Trans i18nKey={titleKey} components={{ accent: <Box component="span" sx={sx.titleAccent} /> }} />
      </Typography>

      <Typography variant="body1" component="p" sx={sx.subtitle}>
        {subtitle}
      </Typography>

      <Box sx={sx.buttons}>
        <Button component={Link} href={ROUTES.STATS} variant="contained" size="large" sx={sx.ctaButton}>
          {ctaLabel}
        </Button>

        <Button
          component={Link}
          href={getDemoHref(undefined, WorkspaceView.STATS)}
          variant="outlined"
          size="large"
          sx={sx.demoButton}
        >
          {t('MISC.VIEW_DEMO')}
        </Button>
      </Box>
    </Box>
  )
}

export default Component
