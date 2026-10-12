'use client'

import { Box, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/common'
import { PageWrapper } from '@/components'
import { useIsDarkMode, useIsMobile } from '@/hooks'
import { Trans, useTranslation } from '@/lib/i18n'
import { Color } from '@/styles/colors'

const Component = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()

  return (
    <PageWrapper>
      <Grid size={12} sx={{ pt: isMobile ? 2 : 6, textAlign: 'center' }}>
        <img
          src={isDarkMode ? '/img/logo-dark.svg' : '/img/logo.svg'}
          alt="fstats"
          style={{ width: isMobile ? 96 : 128, height: 'auto', marginBottom: 24 }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
          <Trans
            i18nKey="EMPTY_STATS_PAGE.TITLE"
            components={{ accent: <Box component="span" sx={{ color: isDarkMode ? Color.cyan : Color.cyanDark }} /> }}
          />
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontSize: isMobile ? 15 : 17, lineHeight: 1.7, mb: 4 }}
        >
          {t('EMPTY_STATS_PAGE.BLURB')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{ minWidth: 200, py: 1.5, px: 5, fontSize: 17, fontWeight: 600, borderRadius: 100 }}
            onMouseEnter={() => router.prefetch(ROUTES.DATA)}
            onClick={() => router.push(ROUTES.DATA)}
          >
            {t('EMPTY_STATS_PAGE.UPLOAD_FILES')}
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              minWidth: 200,
              py: 1.5,
              px: 5,
              fontSize: 17,
              fontWeight: 600,
              borderRadius: 100,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
            onMouseEnter={() => router.prefetch(`${ROUTES.STATS}?demo=true`)}
            onClick={() => router.push(`${ROUTES.STATS}?demo=true`)}
          >
            {t('MISC.VIEW_DEMO')}
          </Button>
        </Box>
      </Grid>
    </PageWrapper>
  )
}

export default Component
