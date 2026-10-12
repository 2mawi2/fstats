'use client'

import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useIsMobile } from '@/hooks'
import { AVAILABLE_PARSERS } from '@/utils/Parser'
import { useTranslation } from '@/lib/i18n'

import { CARD_ITEMS, STEPS } from './actions'
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
        <Box sx={sx.bankGrid}>
          {Array.from(new Set(Object.values(AVAILABLE_PARSERS).map((parser) => parser.bankName))).map((bankName) => (
            <Chip key={bankName} label={bankName} sx={sx.bankChip} />
          ))}
        </Box>
      </Box>
    </PageWrapper>
  )
}

export default Page
