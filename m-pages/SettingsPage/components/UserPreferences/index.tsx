'use client'

import { Box, Card, Typography } from '@mui/material'

import { DateFormatSwitcher, LanguageSwitcher, ThemeSwitcher } from '@/components'
import { useTranslation } from '@/lib/i18n'
import { isFeatureEnabled } from '@/utils/Features'

const Component = () => {
  const { t } = useTranslation()
  const isWip = isFeatureEnabled('wip')

  return (
    <Card sx={{ borderRadius: 2, p: 3 }}>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        {t('SETTINGS_PAGE.PREFERENCES.TITLE')}
      </Typography>

      <Box>
        <Typography component="div" sx={{ fontSize: 14, mb: 1 }}>
          {t('COMPONENTS.THEME_SWITCHER.THEME')}
        </Typography>
        <ThemeSwitcher showLabel />
      </Box>

      {isWip ? (
        <Box sx={{ mt: 3 }}>
          <Typography component="div" sx={{ fontSize: 14, mb: 1 }}>
            {t('COMPONENTS.LANGUAGE_SWITCHER.LANGUAGE')}
          </Typography>
          <LanguageSwitcher showLabel />
        </Box>
      ) : null}

      <Box sx={{ mt: 3 }}>
        <Typography component="div" sx={{ fontSize: 14, mb: 1 }}>
          {t('COMPONENTS.DATE_FORMAT_SWITCHER.TITLE')}
        </Typography>
        <DateFormatSwitcher showLabel />
      </Box>
    </Card>
  )
}

export default Component
