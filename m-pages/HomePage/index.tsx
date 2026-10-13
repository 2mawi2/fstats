'use client'

import { GitHub } from '@mui/icons-material'
import { Box, Link as MuiLink, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { CONFIG } from '@/common'
import { PageWrapper } from '@/components'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { BADGES, getFlagEmoji, getSupportedBanks, STEPS } from './actions'
import { Hero } from './components'
import { ui } from './styled'

const Page = () => {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const sx = ui(theme, isMobile)
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <Hero
        titleKey="HOME_PAGE.HERO_TITLE"
        subtitle={t('HOME_PAGE.HERO_SUBTITLE')}
        ctaLabel={t('HOME_PAGE.GET_STARTED')}
      />

      <Box component="ul" sx={sx.badges}>
        {BADGES.map(({ Icon, key }) => (
          <Box component="li" key={key} sx={sx.badge}>
            <Icon sx={sx.badgeIcon} />
            {t(`HOME_PAGE.BADGES.${key}`)}
          </Box>
        ))}
      </Box>

      <Box component="section" sx={sx.section}>
        <Typography variant="h5" component="h2" sx={sx.sectionTitle}>
          {t('HOME_PAGE.OPEN_SOURCE.TITLE')}
        </Typography>
        <Typography variant="body1" component="p" sx={sx.sectionSubtitle}>
          {t('HOME_PAGE.OPEN_SOURCE.DESCRIPTION')}
        </Typography>
        <Box sx={sx.centered}>
          <MuiLink href={CONFIG.GITHUB_URL} target="_blank" rel="noopener noreferrer" sx={sx.link}>
            <GitHub sx={sx.linkIcon} />
            {t('ABOUT_PAGE.VIEW_ON_GITHUB')}
          </MuiLink>
        </Box>
      </Box>

      <Box component="section" sx={sx.section}>
        <Typography variant="h5" component="h2" sx={sx.sectionTitle}>
          {t('HOME_PAGE.HOW_IT_WORKS')}
        </Typography>

        <Box component="ol" sx={sx.steps}>
          {STEPS.map(({ step, key }) => (
            <Box component="li" key={step} sx={sx.step}>
              <Box sx={sx.stepNumber}>{step}</Box>
              <Box>
                <Typography variant="h6" component="h3" sx={sx.cardTitle}>
                  {t(`HOME_PAGE.STEPS.${key}.TITLE`)}
                </Typography>
                <Typography variant="body2" sx={sx.cardDescription}>
                  {t(`HOME_PAGE.STEPS.${key}.DESCRIPTION`)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box component="section" sx={sx.section}>
        <Typography variant="h5" component="h2" sx={sx.sectionTitle}>
          {t('HOME_PAGE.SUPPORTED_BANKS')}
        </Typography>

        <Box component="ul" sx={sx.bankList}>
          {getSupportedBanks().map(({ name, country }) => (
            <Box component="li" key={name} title={t(`COUNTRY.${country}`)} sx={sx.bankItem}>
              <Box component="span" aria-hidden>
                {getFlagEmoji(country)}
              </Box>
              {name}
            </Box>
          ))}
        </Box>

        <Typography variant="body2" sx={sx.missingBank}>
          {t('HOME_PAGE.MISSING_BANK')}{' '}
          <MuiLink href={`${CONFIG.GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" sx={sx.inlineLink}>
            {t('HOME_PAGE.REQUEST_BANK')}
          </MuiLink>
        </Typography>
      </Box>
    </PageWrapper>
  )
}

export default Page
