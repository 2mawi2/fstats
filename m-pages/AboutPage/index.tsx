'use client'

import { GitHub } from '@mui/icons-material'
import { Button, Grid, Typography } from '@mui/material'

import { CONFIG } from '@/common'
import { PageWrapper } from '@/components'
import { useTranslation } from '@/lib/i18n'

const Component = () => {
  const { t } = useTranslation()

  return (
    <PageWrapper>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography component="h2" sx={{ fontSize: 24, fontWeight: 500 }}>
            {t('ABOUT_PAGE.TITLE')}
          </Typography>
        </Grid>

        <Grid size={12}>
          <Typography color="text.secondary">{t('ABOUT_PAGE.BLURB')}</Typography>
        </Grid>

        <Grid size={12}>
          <Button
            size="large"
            startIcon={<GitHub />}
            href={CONFIG.GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('ABOUT_PAGE.VIEW_ON_GITHUB')}
          </Button>
        </Grid>

        <Grid size={12}>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            © 2025 fstats. {t('MISC.ALL_RIGHTS_RESERVED')} {t('MISC.VERSION')}: v{CONFIG.APP_VERSION}
          </Typography>
        </Grid>
      </Grid>
    </PageWrapper>
  )
}

export default Component
