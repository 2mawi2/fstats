'use client'

import { Box, Button, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useIsMobile } from '@/hooks'
import { useTranslation } from '@/lib/i18n'

import { CARD_ITEMS, getBanksByCountry, getFlagEmoji, STEPS } from './actions'
import { Hero } from './components'
import { ctaButton, ui } from './styled'

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

      <Grid container spacing={isMobile ? 2 : 3} sx={sx.trustSection}>
        {CARD_ITEMS.map(({ Icon, key }) => (
          <Grid size={isMobile ? 12 : 4} key={key}>
            <Box sx={sx.trustCard}>
              <Icon sx={sx.trustIcon} />
              <Typography variant="h6" sx={sx.trustTitle}>
                {t(`HOME_PAGE.CARDS.${key}.TITLE`)}
              </Typography>
              <Typography variant="body2" sx={sx.trustDescription}>
                {t(`HOME_PAGE.CARDS.${key}.DESCRIPTION`)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={sx.section}>
        <Typography variant="h5" sx={sx.sectionTitle}>
          {t('HOME_PAGE.HOW_IT_WORKS')}
        </Typography>

        <Grid container spacing={isMobile ? 3 : 4} sx={{ mb: 6 }}>
          {STEPS.map(({ step, key }) => (
            <Grid size={isMobile ? 12 : 4} key={step}>
              <Box sx={sx.stepCard}>
                <Box sx={sx.stepBadge}>{step}</Box>
                <Typography variant="h6" sx={sx.stepTitle}>
                  {t(`HOME_PAGE.STEPS.${key}.TITLE`)}
                </Typography>
                <Typography variant="body2" sx={sx.stepDescription}>
                  {t(`HOME_PAGE.STEPS.${key}.DESCRIPTION`)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Button component={Link} href={ROUTES.DATA} variant="contained" size="large" sx={ctaButton}>
          {t('HOME_PAGE.GET_STARTED_NOW')}
        </Button>
      </Box>

      <Box sx={sx.banksSection}>
        <Typography variant="h6" sx={sx.sectionTitle}>
          {t('HOME_PAGE.SUPPORTED_BANKS')}
        </Typography>
        <Grid container spacing={isMobile ? 2 : 3} sx={sx.countryGrid}>
          {Object.entries(getBanksByCountry()).map(([country, bankNames]) => (
            <Grid size={isMobile ? 12 : 4} key={country}>
              <Box sx={sx.trustCard}>
                <Box component="span" role="img" aria-hidden sx={sx.countryFlag}>
                  {getFlagEmoji(country)}
                </Box>
                <Typography variant="h6" component="h3" sx={sx.trustTitle}>
                  {t(`COUNTRY.${country}`)}
                </Typography>
                <Box component="ul" sx={sx.bankList}>
                  {bankNames.map((bankName) => (
                    <Box component="li" key={bankName} sx={sx.bankItem}>
                      {bankName}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageWrapper>
  )
}

export default Page
