'use client'

import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

import { getDemoHref, ROUTES, WorkspaceView } from '@/common'
import { useIsMobile } from '@/hooks'
import { Trans, useTranslation } from '@/lib/i18n'

import { ui } from './styled'

/**
 * Logo, title with accent, subtitle and the "get started" / demo buttons.
 */
const Component = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const theme = useTheme()
  const sx = ui(theme, isMobile)

  return (
    <Box sx={sx.hero}>
      {/* Both, switched via CSS, so there's no flash before the colour scheme is known */}
      <Box component="img" src="/img/logo.svg" alt="fstats" sx={sx.logo} />
      <Box component="img" src="/img/logo-dark.svg" alt="fstats" sx={sx.logoDark} />

      <Typography variant="h1" sx={sx.title}>
        <Trans i18nKey="HOME_PAGE.HERO_TITLE" components={{ accent: <Box component="span" sx={sx.titleAccent} /> }} />
      </Typography>

      <Typography variant="body1" component="p" sx={sx.subtitle}>
        {t('HOME_PAGE.HERO_SUBTITLE')}
      </Typography>

      <Box sx={sx.buttons}>
        <Button component={Link} href={ROUTES.STATS} variant="contained" size="large" sx={sx.ctaButton}>
          {t('HOME_PAGE.GET_STARTED')}
        </Button>

        <Button
          component={Link}
          href={getDemoHref({ view: WorkspaceView.STATS })}
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
